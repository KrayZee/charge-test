import 'angular-chart.js/dist/angular-chart.css';

import angular from 'angular';
import angularChart from 'angular-chart.js/dist/angular-chart';

function CreateCharts(ChartJs) {
    var helpers = ChartJs.Chart.helpers;

    ChartJs.Chart.types.Bar.extend({
        name: "AnnualCosts",
        defaults: {
            animationEasing: 'easeInOutQuad',
            barDatasetSpacing : 0,
            barShowStroke : false,
            diffWidth: 0.25,
            diffPositiveColor: '#72AC45',
            diffNegativeColor: '#FE0002',
            barValueSpacing: 15,
            scaleShowHorizontalLines: false,
            scaleShowVerticalLines: false,
            scaleLineColor: "black",
            scaleFontSize: 11,
            showTooltips: false,
            legendTemplate : `<ul class="<%=name.toLowerCase()%>-legend">
                <% for (var i=0; i<datasets.length; i++){%>
                <li><span style="background-color:<%=datasets[i].fillColor%>"></span>
                <%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>
                <li><span style="background-color:<%=options.diffPositiveColor%>"></span>Positive difference</li>
                <li><span style="background-color:<%=options.diffNegativeColor%>"></span>Negative difference</li>
                </ul>`
        },

        initialize: function(data) {
            // expose options as a scope variable here so we can access it in the ScaleClass
            var options = this.options;

            this.ScaleClass = ChartJs.Chart.Scale.extend({
                offsetGridLines: true,
                calculateBarX: function(datasetCount, datasetIndex, barIndex) {
                    // reusable method for calculating the xPosition of a given bar
                    // based on datasetIndex & width of the bar
                    var xWidth = this.calculateBaseWidth(),
                        xAbsolute = this.calculateX(barIndex) - (xWidth/2),
                        barWidth = this.calculateBarWidth(datasetCount);

                    return xAbsolute + (barWidth * datasetIndex) +
                        (datasetIndex * options.barDatasetSpacing) + barWidth/2;
                },
                calculateBaseWidth: function() {
                    return (this.calculateX(1) - this.calculateX(0)) - (2 * options.barValueSpacing);
                },
                calculateBarWidth: function(datasetCount) {
                    // the padding between datasets is to the right of each bar,
                    // providing that there are more than 1 dataset
                    var baseWidth = this.calculateBaseWidth() - ((datasetCount - 1) * options.barDatasetSpacing);

                    return (baseWidth / datasetCount);
                },

                draw: function() {
                    var ctx = this.ctx,
                        yLabelGap = (this.endPoint - this.startPoint) / this.steps,
                        xStart = Math.round(this.xScalePaddingLeft);

                    if (this.display) {
                        ctx.fillStyle = this.textColor;
                        ctx.font = this.font;

                        helpers.each(this.yLabels, function(labelString, index) {
                            var yLabelCenter = this.endPoint - (yLabelGap * index),
                                linePositionY = Math.round(yLabelCenter),
                                drawHorizontalLine = this.showHorizontalLines;

                            ctx.textAlign = "right";
                            ctx.textBaseline = "middle";
                            if (this.showLabels){
                                ctx.fillText(labelString, xStart - 10, yLabelCenter);
                            }

                            // This is X axis, so draw it
                            if (index === 0 && !drawHorizontalLine) {
                                drawHorizontalLine = true;
                            }

                            if (drawHorizontalLine){
                                ctx.beginPath();
                            }

                            if (index > 0){
                                // This is a grid line in the centre, so drop that
                                ctx.lineWidth = this.gridLineWidth;
                                ctx.strokeStyle = this.gridLineColor;
                            } else {
                                // This is the first line on the scale
                                ctx.lineWidth = this.lineWidth;
                                ctx.strokeStyle = this.lineColor;
                            }

                            linePositionY += helpers.aliasPixel(ctx.lineWidth);

                            if (drawHorizontalLine) {
                                ctx.moveTo(xStart, linePositionY);
                                ctx.lineTo(this.width, linePositionY);
                                ctx.stroke();
                                ctx.closePath();
                            }

                        }, this);

                        helpers.each(this.xLabels, function(label, index) {
                            var xPos = this.calculateX(index) + helpers.aliasPixel(this.lineWidth),
                            // Check to see if line/bar here and decide where to place the line
                                linePos = this.calculateX(index - (this.offsetGridLines ? 0.5 : 0))
                                    + helpers.aliasPixel(this.lineWidth),
                                isRotated = (this.xLabelRotation > 0),
                                drawVerticalLine = this.showVerticalLines;

                            // This is Y axis, so draw it
                            if (drawVerticalLine){
                                ctx.beginPath();
                            }

                            if (index > 0){
                                // This is a grid line in the centre, so drop that
                                ctx.lineWidth = this.gridLineWidth;
                                ctx.strokeStyle = this.gridLineColor;
                            } else {
                                // This is the first line on the scale
                                ctx.lineWidth = this.lineWidth;
                                ctx.strokeStyle = this.lineColor;
                            }

                            if (drawVerticalLine){
                                ctx.moveTo(linePos,this.endPoint);
                                ctx.lineTo(linePos,this.startPoint - 3);
                                ctx.stroke();
                                ctx.closePath();
                            }


                            ctx.lineWidth = this.lineWidth;
                            ctx.strokeStyle = this.lineColor;

                            ctx.save();
                            ctx.translate(xPos,(isRotated) ? this.endPoint + 12 : this.endPoint + 8);
                            ctx.rotate(helpers.radians(this.xLabelRotation)*-1);
                            ctx.font = this.font;
                            ctx.textAlign = (isRotated) ? "right" : "center";
                            ctx.textBaseline = (isRotated) ? "middle" : "top";
                            ctx.fillText(label, 0, 0);
                            ctx.restore();
                        }, this);
                    }
                }
            });

            this.datasets = [];

            // set up tooltip events on the chart
            if (this.options.showTooltips) {
                helpers.bindEvents(this, this.options.tooltipEvents, function(evt) {
                    let activeBars = (evt.type !== 'mouseout') ? this.getBarsAtEvent(evt) : [];

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

            // declare the extension of the default point,
            // to cater for the options passed in to the constructor
            this.BarClass = ChartJs.Chart.Rectangle.extend({
                strokeWidth: this.options.barStrokeWidth,
                showStroke: this.options.barShowStroke,
                ctx: this.chart.ctx,
                diff: null
            });

            // declare diff class
            this.DiffClass = this.BarClass.extend({
                bar1: null,
                bar2: null
            });

            // iterate through each of the datasets,
            // and build this into a property of the chart
            helpers.each(data.datasets, function(dataset, datasetIndex) {
                var datasetObject = {
                    label : dataset.label || null,
                    fillColor : dataset.fillColor,
                    strokeColor : dataset.strokeColor,
                    bars : []
                };

                this.datasets.push(datasetObject);

                helpers.each(dataset.data, function(dataPoint, dataIndex) {
                    // add a new point for each piece of data, passing any required data to draw.
                    datasetObject.bars.push(new this.BarClass({
                        value: dataPoint,
                        label: data.labels[dataIndex],
                        datasetLabel: dataset.label,
                        strokeColor : dataset.strokeColor,
                        fillColor : dataset.fillColor,
                        highlightFill : dataset.highlightFill || dataset.fillColor,
                        highlightStroke : dataset.highlightStroke || dataset.strokeColor
                    }));

                    // add a new diff bar for two paired bars of nearest datasets

                    // skip diff creation for first dataset,
                    // because there is no another datasets
                    if (datasetIndex < 1) return;

                    let index = datasetObject.bars.length - 1;
                    let bar = datasetObject.bars[index];

                    // skip diff creation when prev dataset has no suitable bar
                    let prevDatasetBars = this.datasets[datasetIndex - 1].bars;
                    if (prevDatasetBars.length <= index) return;

                    bar.diff = new this.DiffClass({
                        bar1: prevDatasetBars[index],
                        bar2: bar
                    });
                }, this);
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

                // update state for diff bar
                var diff = bar.diff;
                if (!diff) return;

                var diffDimensions = this.getDiffDimensions(diff);
                var diffColor = this.getDiffColor(diff);

                helpers.extend(diff, diffDimensions, {
                    strokeColor: diffColor,
                    fillColor: diffColor
                });
                diff.save();
            }, this);

            this.render();
        },

        /**
         * @param {DiffClass} diff
         * @returns {{value: number, width: number, base: *, x: number, y: *}}
         */
        getDiffDimensions: function(diff) {
            let bar1 = diff.bar1, bar2 = diff.bar2;
            let value = this.getDiffValue(diff);
            let width = bar1.width * this.options.diffWidth;

            // draw diff on bar1 if bar2.value > bar1.value
            // draw diff on bar2 if bar1.value > bar2.value
            let x = value < 0 ? bar2.x - (bar2.width + width) / 2 : bar2.x - (bar2.width - width) / 2;

            return {
                value: value,
                width: width,
                base: bar1.y,
                x: x,
                y: bar2.y
            }
        },

        /**
         * @param {DiffClass} diff
         * @returns {number}
         */
        getDiffValue: function(diff) {
            return diff.bar1.value - diff.bar2.value;
        },

        /**
         * @param {DiffClass} diff
         * @returns {number}
         */
        getDiffColor: function(diff) {
            return this.getDiffValue(diff) < 0
                ? this.options.diffNegativeColor : this.options.diffPositiveColor;
        },

        eachBars: function(callback){
            helpers.each(this.datasets,function(dataset, datasetIndex){
                helpers.each(dataset.bars, callback, this, datasetIndex);
            },this);
        },

        update: function() {
            this.scale.update();
            // Reset any highlight colours before updating.
            helpers.each(this.activeElements, function(activeElement){
                activeElement.restore(['fillColor', 'strokeColor']);
            });

            this.eachBars(function(bar){
                bar.save();
                bar.diff ? bar.diff.save() : null;

            });
            this.render();
        },

        draw: function (ease) {
            var easingDecimal = ease || 1;
            this.clear();
            this.scale.draw(easingDecimal);

            // draw all the bars for each dataset
            helpers.each(this.datasets, function (dataset, datasetIndex) {
                helpers.each(dataset.bars, function (bar, index) {
                    if (!bar.hasValue()) return;

                    bar.base = this.scale.endPoint;

                    // transition then draw
                    bar.transition({
                        x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
                        y: this.scale.calculateY(bar.value),
                        width: this.scale.calculateBarWidth(this.datasets.length)
                    }, easingDecimal).draw();

                    // update state for diff bar
                    var diff = bar.diff;
                    if (!diff) return;

                    var diffDimensions = this.getDiffDimensions(diff);
                    var diffColor = this.getDiffColor(diff);

                    diff.strokeColor = diff.fillColor = diffColor;
                    diff.transition(diffDimensions, easingDecimal).draw();
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