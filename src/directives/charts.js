import 'angular-chart.js/dist/angular-chart.css';

import angular from 'angular';
import angularChart from 'angular-chart.js/dist/angular-chart';

function CreateCharts(ChartJs) {
    var helpers = ChartJs.Chart.helpers;

    ChartJs.Chart.types.Bar.extend({
        name: "AnnualCosts",
        defaults: {
            barDatasetSpacing : 0,
            barShowStroke : false,
            diffWidth: 0.2,
            diffPositiveColor: '#72AC45',
            diffNegativeColor: '#FE0002'
        },
        initialize:  function(data){

            //Expose options as a scope variable here so we can access it in the ScaleClass
            var options = this.options;

            this.ScaleClass = ChartJs.Chart.Scale.extend({
                offsetGridLines : true,
                calculateBarX : function(datasetCount, datasetIndex, barIndex){
                    //Reusable method for calculating the xPosition of a given bar based on datasetIndex & width of the bar
                    var xWidth = this.calculateBaseWidth(),
                        xAbsolute = this.calculateX(barIndex) - (xWidth/2),
                        barWidth = this.calculateBarWidth(datasetCount);

                    return xAbsolute + (barWidth * datasetIndex) + (datasetIndex * options.barDatasetSpacing) + barWidth/2;
                },
                calculateBaseWidth : function(){
                    return (this.calculateX(1) - this.calculateX(0)) - (2*options.barValueSpacing);
                },
                calculateBarWidth : function(datasetCount){
                    //The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
                    var baseWidth = this.calculateBaseWidth() - ((datasetCount - 1) * options.barDatasetSpacing);

                    return (baseWidth / datasetCount);
                }
            });

            this.datasets = [];

            //Set up tooltip events on the chart
            if (this.options.showTooltips){
                helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
                    var activeBars = (evt.type !== 'mouseout') ? this.getBarsAtEvent(evt) : [];

                    this.eachBars(function(bar){
                        bar.restore(['fillColor', 'strokeColor']);
                    });
                    helpers.each(activeBars, function(activeBar){
                        activeBar.fillColor = activeBar.highlightFill;
                        activeBar.strokeColor = activeBar.highlightStroke;
                    });
                    this.showTooltip(activeBars);
                });
            }

            //Declare the extension of the default point, to cater for the options passed in to the constructor
            this.BarClass = ChartJs.Chart.Rectangle.extend({
                strokeWidth : this.options.barStrokeWidth,
                showStroke : this.options.barShowStroke,
                ctx : this.chart.ctx
            });

            //Iterate through each of the datasets, and build this into a property of the chart
            helpers.each(data.datasets,function(dataset,datasetIndex){

                var datasetObject = {
                    label : dataset.label || null,
                    fillColor : dataset.fillColor,
                    strokeColor : dataset.strokeColor,
                    bars : [],
                    diff : []
                };

                this.datasets.push(datasetObject);

                helpers.each(dataset.data,function(dataPoint,index){
                    //Add a new point for each piece of data, passing any required data to draw.
                    datasetObject.bars.push(new this.BarClass({
                        value : dataPoint,
                        label : data.labels[index],
                        datasetLabel: dataset.label,
                        strokeColor : dataset.strokeColor,
                        fillColor : dataset.fillColor,
                        highlightFill : dataset.highlightFill || dataset.fillColor,
                        highlightStroke : dataset.highlightStroke || dataset.strokeColor
                    }));

                    if (datasetIndex < 1) return;

                    //Add a new diff bar for each piece of data, passing any required data to draw.
                    if (!this.datasets[datasetIndex].diff) this.datasets[datasetIndex].diff = [];

                    var prevDatasetBars = this.datasets[datasetIndex - 1].bars;
                    if (prevDatasetBars.length < this.datasets[datasetIndex].diff.length) return;

                    var prevDatasetValue = prevDatasetBars[this.datasets[datasetIndex].diff.length].value;
                    var diffValue = prevDatasetValue - dataPoint;

                    this.datasets[datasetIndex].diff.push(new this.BarClass({
                        value : diffValue,
                        strokeColor : null,
                        fillColor : diffValue < 0 ? this.options.diffNegativeColor : this.options.diffPositiveColor
                    }));
                },this);

            },this);

            this.buildScale(data.labels);

            this.BarClass.prototype.base = this.scale.endPoint;

            this.eachBars(function(bar, index, datasetIndex) {
                helpers.extend(bar, {
                    width : this.scale.calculateBarWidth(this.datasets.length),
                    x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
                    y: this.scale.endPoint
                });
                bar.save();

                var diff = this.datasets[datasetIndex].diff[index];
                if (!diff) return;

                var prevDatasetBars = this.datasets[datasetIndex - 1].bars;

                var diffWidth = this.scale.calculateBarWidth(this.datasets.length) * this.options.diffWidth;
                var diffX = diff.value < 0 ? bar.x - (bar.width + diffWidth) / 2 : bar.x - (bar.width - diffWidth) / 2;

                helpers.extend(diff, {
                    base: prevDatasetBars[index].y,
                    width : diffWidth,
                    x: diffX,
                    y: bar.y + bar.value
                });
                diff.save();
            }, this);

            this.render();
        },
        eachBars : function(callback){
            helpers.each(this.datasets,function(dataset, datasetIndex){
                helpers.each(dataset.bars, callback, this, datasetIndex);
            },this);
        },
        addData : function(valuesArray,label){
            //Map the values array for each of the datasets
            helpers.each(valuesArray, function(value, datasetIndex) {
                //Add a new point for each piece of data, passing any required data to draw.
                this.datasets[datasetIndex].bars.push(new this.BarClass({
                    value : value,
                    label : label,
                    x: this.scale.calculateBarX(this.datasets.length, datasetIndex, this.scale.valuesCount+1),
                    y: this.scale.endPoint,
                    width : this.scale.calculateBarWidth(this.datasets.length),
                    base : this.scale.endPoint,
                    strokeColor : this.datasets[datasetIndex].strokeColor,
                    fillColor : this.datasets[datasetIndex].fillColor
                }));

                if (datasetIndex < 1) return;

                //Add a new diff bar for each piece of data, passing any required data to draw.
                if (!this.datasets[datasetIndex].diff) this.datasets[datasetIndex].diff = [];

                var prevDatasetBars = this.datasets[datasetIndex - 1].bars;
                if (prevDatasetBars.length < this.datasets[datasetIndex].diff.length) return;

                var prevDatasetValue = prevDatasetBars[this.datasets[datasetIndex].diff.length].value;

                var index = this.datasets[datasetIndex].bars.length - 1;
                var bar = this.datasets[datasetIndex].bars[index];
                var diffValue = prevDatasetValue - value;
                var diffWidth = this.scale.calculateBarWidth(this.datasets.length) * this.options.diffWidth;
                var diffX = diffValue < 0 ? bar.x - (bar.width + diffWidth) / 2 : bar.x - (bar.width - diffWidth) / 2;

                this.datasets[datasetIndex].diff.push(new this.BarClass({
                    value : diffValue,
                    x: diffX,
                    y: bar.y,
                    width : diffWidth,
                    base : prevDatasetBars[index],
                    strokeColor : null,
                    fillColor : diffValue < 0 ? this.options.diffNegativeColor : this.options.diffPositiveColor
                }));
            },this);

            this.scale.addXLabel(label);
            //Then re-render the chart.
            this.update();
        },
        removeData : function(){
            this.scale.removeXLabel();
            //Then re-render the chart.
            helpers.each(this.datasets,function(dataset){
                dataset.bars.shift();
                if (this.datasets[datasetIndex].diff.length > 0) dataset.diff.shift();
            },this);
            this.update();
        },
        draw: function (ease) {
            var easingDecimal = ease || 1;
            this.clear();

            var ctx = this.chart.ctx;

            this.scale.draw(easingDecimal);

            //Draw all the bars for each dataset
            helpers.each(this.datasets, function (dataset, datasetIndex) {
                helpers.each(dataset.bars, function (bar, index) {
                    if (bar.hasValue()) {
                        bar.base = this.scale.endPoint;
                        //Transition then draw
                        bar.transition({
                            x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
                            y: this.scale.calculateY(bar.value),
                            width: this.scale.calculateBarWidth(this.datasets.length)
                        }, easingDecimal).draw();

                        if (datasetIndex > 0) {
                            // todo: move calculation to function
                            if (!this.datasets[datasetIndex].diff) return;
                            if (this.datasets[datasetIndex].diff.length < index + 1) return;

                            var diff = this.datasets[datasetIndex].diff[index];

                            var prevDatasetBars = this.datasets[datasetIndex - 1].bars;
                            if (prevDatasetBars.length < this.datasets[datasetIndex].diff.length) return;

                            var prevDatasetValue = prevDatasetBars[index].value;
                            var diffValue = prevDatasetValue - bar.value;

                            var diffWidth = this.scale.calculateBarWidth(this.datasets.length) * this.options.diffWidth;
                            var diffX = diffValue < 0 ? bar.x - (bar.width + diffWidth) / 2 : bar.x - (bar.width - diffWidth) / 2;

                            diff.base = prevDatasetBars[index].y;

                            //Transition then draw
                            diff.fillColor = diffValue < 0 ? this.options.diffNegativeColor : this.options.diffPositiveColor;
                            diff.transition({
                                value: diffValue,
                                x: diffX,
                                y: bar.y,
                                width : diffWidth
                            }, easingDecimal).draw();
                        }
                    }
                }, this);

            }, this);
        }
    });
}

CreateCharts.$inject = ['ChartJs'];

export default angular.module('app.directives.calculator-charts', [angularChart.name])
    .run(CreateCharts)
    .directive('chartAnnualCosts', ['ChartJsFactory', function (ChartJsFactory) { return new ChartJsFactory('AnnualCosts'); }])
    .directive('chartSavings', ['ChartJsFactory', function (ChartJsFactory) { return new ChartJsFactory('Savings'); }])
.name;