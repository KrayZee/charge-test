import 'angular-chart.js/dist/angular-chart.css';

import angular from 'angular';
import angularChart from 'angular-chart.js/dist/angular-chart';

// AHTUNG! There are 99% of code copy pasted from original chart.js

function CreateCharts(ChartJs, $filter) {
    var helpers = ChartJs.Chart.helpers;

    var ScaleWithLabels = function(options) {
        return ChartJs.Chart.Scale.extend({
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
                return (this.calculateX(1) - this.calculateX(0)) / options.barValueSpacing;
            },

            calculateBarWidth: function(datasetCount) {
                // the padding between datasets is to the right of each bar,
                // providing that there are more than 1 dataset
                var baseWidth = this.calculateBaseWidth() - ((datasetCount - 1) * options.barDatasetSpacing);

                return (baseWidth / datasetCount);
            },

            // fitting loop to rotate x Labels and figure out what fits there,
            // and also calculate how many Y steps to use
            fit: function() {
                // first we need the width of the yLabels, assuming the xLabels aren't rotated

                // to do that we need the base line at the top and base of the chart,
                // assuming there is no x label rotation
                this.startPoint = (this.display) ? this.fontSize : 0;
                this.endPoint = (this.display) ? this.height - (this.fontSize * 1.5) - 25 : this.height; // -25 to pad labels

                // apply padding settings to the start and end point.
                this.startPoint += this.padding;
                this.endPoint -= this.padding;

                // Cache the starting height, so can determine if we need to recalculate the scale yAxis
                var cachedHeight = this.endPoint - this.startPoint,
                    cachedYLabelWidth;

                // build the current yLabels so we have an idea of what size they'll be to start
                /*
                 *	This sets what is returned from calculateScaleRange as static properties of this class:
                 *
                 this.steps;
                 this.stepValue;
                 this.min;
                 this.max;
                 *
                 */
                this.calculateYRange(cachedHeight);

                // With these properties set we can now build the array of yLabels
                // and also the width of the largest yLabel
                this.buildYLabels();

                this.calculateXLabelRotation();

                while((cachedHeight > this.endPoint - this.startPoint)){
                    cachedHeight = this.endPoint - this.startPoint;
                    cachedYLabelWidth = this.yLabelWidth;

                    this.calculateYRange(cachedHeight);
                    this.buildYLabels();

                    // Only go through the xLabel loop again if the yLabel width has changed
                    if (cachedYLabelWidth < this.yLabelWidth){
                        this.calculateXLabelRotation();
                    }
                }

            },

            calculateXLabelRotation: function() {
                //Get the width of each grid by calculating the difference
                //between x offsets between 0 and 1.

                this.ctx.font = this.font;

                var firstWidth = this.ctx.measureText(this.xLabels[0]).width,
                    lastWidth = this.ctx.measureText(this.xLabels[this.xLabels.length - 1]).width,
                    firstRotated,
                    lastRotated;


                this.xScalePaddingRight = lastWidth/2 + 3;
                this.xScalePaddingLeft = (firstWidth/2 > this.yLabelWidth + 10) ? firstWidth/2 : this.yLabelWidth + 30;

                this.xLabelRotation = 0;
                if (this.display){
                    var originalLabelWidth = helpers.longestText(this.ctx,this.font,this.xLabels),
                        cosRotation,
                        firstRotatedWidth;
                    this.xLabelWidth = originalLabelWidth;
                    //Allow 3 pixels x2 padding either side for label readability
                    var xGridWidth = Math.floor(this.calculateX(1) - this.calculateX(0)) - 6;

                    //Max label rotate should be 90 - also act as a loop counter
                    while ((this.xLabelWidth > xGridWidth && this.xLabelRotation === 0) || (this.xLabelWidth > xGridWidth && this.xLabelRotation <= 90 && this.xLabelRotation > 0)){
                        cosRotation = Math.cos(helpers.radians(this.xLabelRotation));

                        firstRotated = cosRotation * firstWidth;
                        lastRotated = cosRotation * lastWidth;

                        // We're right aligning the text now.
                        if (firstRotated + this.fontSize / 2 > this.yLabelWidth + 8){
                            this.xScalePaddingLeft = firstRotated + this.fontSize / 2;
                        }
                        this.xScalePaddingRight = this.fontSize/2;


                        this.xLabelRotation++;
                        this.xLabelWidth = cosRotation * originalLabelWidth;

                    }
                    if (this.xLabelRotation > 0){
                        this.endPoint -= Math.sin(helpers.radians(this.xLabelRotation))*originalLabelWidth + 3;
                    }
                }
                else{
                    this.xLabelWidth = 0;
                    this.xScalePaddingRight = this.padding;
                    this.xScalePaddingLeft = this.padding;
                }

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
                            linePositionY = Math.round(yLabelCenter) - 1,
                            drawHorizontalLine = this.showHorizontalLines;

                        ctx.textAlign = "right";
                        ctx.textBaseline = "middle";
                        if (this.showLabels){
                            ctx.fillText(labelString, xStart - 10, yLabelCenter);
                        }

                        // This is X axis, so draw it
                        let labelNumber = parseFloat(labelString);
                        let isAxis = isNaN(labelNumber) && index === 0 || labelNumber === 0;

                        if (isAxis) drawHorizontalLine = true;

                        if (drawHorizontalLine){
                            ctx.beginPath();
                        }

                        if (!isAxis) {
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
                        // check to see if line/bar here and decide where to place the line
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
                            ctx.moveTo(linePos, this.endPoint);
                            ctx.lineTo(linePos, this.startPoint - 3);
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

                    // draw scale labels
                    if (options.scaleLabelX) {
                        ctx.font = this.font;
                        ctx.textAlign = 'right';
                        ctx.textBaseline = 'bottom';
                        ctx.fillText(options.scaleLabelX, this.width - 25 + options.scaleLabelXOffsetX, this.height + options.scaleLabelXOffsetY);
                    }

                    if (options.scaleLabelY) {
                        ctx.save();
                        ctx.translate(0, 8);
                        ctx.rotate(helpers.radians(90) * -1);
                        ctx.font = this.font;
                        ctx.textAlign = 'right';
                        ctx.textBaseline = 'top';
                        ctx.fillText(options.scaleLabelY, 0, 0);
                        ctx.restore();
                    }

                    if (options.title) {
                        ctx.fillStyle = 'black';
                        ctx.font = helpers.fontString(options.scaleFontSize + 3, options.scaleFontStyle, options.scaleFontFamily);
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'top';
                        ctx.fillText(options.title, this.xScalePaddingLeft + 10, 5);
                    }
                }
            }
        });
    };

    ChartJs.Chart.types.Bar.extend({
        name: "AnnualCosts",
        defaults: {
            animationEasing: 'easeInOutQuad',
            barDatasetSpacing : 0,
            barShowStroke : false,
            diffWidth: 0.25,
            diffPositiveColor: '#72AC45',
            diffNegativeColor: '#FE0002',
            barValueSpacing: 1.5,
            scaleShowHorizontalLines: false,
            scaleShowVerticalLines: false,
            scaleLineColor: "black",
            scaleFontSize: 11,
            showTooltips: true,
            title: null,
            scaleLabelX: null,
            scaleLabelY: null,
            scaleLabelXOffsetX: 0,
            scaleLabelXOffsetY: 0,
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

            this.ScaleClass = ScaleWithLabels(options);

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

            this.scale.draw(easingDecimal);
        }
    });

    ChartJs.Chart.types.Bar.extend({
        name: "Savings",
        defaults: {
            animationEasing: 'easeInOutQuad',
            barDatasetSpacing : 0,
            barShowStroke : false,
            diffWidth: 0.25,
            diffPositiveColor: '#72AC45',
            diffNegativeColor: '#FE0002',
            barValueSpacing: 2,
            scaleBeginAtZero: false,
            scaleShowHorizontalLines: false,
            scaleShowVerticalLines: false,
            scaleLineColor: 'black',
            scaleFontSize: 11,
            showTooltips: false,
            title: null,
            scaleLabelX: null,
            scaleLabelXOffsetX: -60,
            scaleLabelXOffsetY: -45,
            scaleLabelY: null
        },

        initialize: function(data) {
            // expose options as a scope variable here so we can access it in the ScaleClass
            var options = this.options;
            var barsFont = helpers.fontString(options.scaleFontSize - 1, options.scaleFontStyle, options.scaleFontFamily);

            this.ScaleClass = ScaleWithLabels(options);

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
                prev: null,
                total: false,

                draw: function() {
                    ChartJs.Chart.Rectangle.prototype.draw.call(this);

                    var ctx = this.ctx;
                    let value = this.value - (this.prev && !this.total ? this.prev.value : 0);
                    let textY = value < 0
                        ? Math.max(this.base, this.y) + 2
                        : Math.min(this.base, this.y) - 2;

                    ctx.font = barsFont;
                    ctx.fillStyle = 'black';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = value < 0 ? 'top' : 'bottom';
                    ctx.fillText($filter('floatingNumber')(value, 2), this.x, textY);

                    if (!this.prev) return;

                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'black';
                    ctx.setLineDash([1, 2]);

                    ctx.moveTo(this.x - this.width / 2, this.prev.y);
                    ctx.lineTo(this.prev.x + this.prev.width / 2, this.prev.y);
                    ctx.stroke();
                    ctx.closePath();

                    ctx.setLineDash([]);
                }
            });

            // iterate through each of the datasets,
            // and build this into a property of the chart
            helpers.each(data.datasets, function(dataset) {
                var datasetObject = {
                    label : dataset.label || null,
                    fillColor : dataset.fillColor,
                    strokeColor : dataset.strokeColor,
                    bars : []
                };

                this.datasets.push(datasetObject);

                helpers.each(dataset.data, function(dataPoint, dataIndex) {
                    let prev = datasetObject.bars.length > 0 ? datasetObject.bars[dataIndex - 1] : null;

                    // add a new point for each piece of data, passing any required data to draw.
                    datasetObject.bars.push(new this.BarClass({
                        prev: prev,
                        total: dataIndex == dataset.data.length - 1,
                        value: dataPoint,
                        label: data.labels[dataIndex],
                        datasetLabel: dataset.label,
                        strokeColor : dataset.strokeColor,
                        fillColor : dataset.fillColor
                    }));
                }, this);
            },this);

            this.buildScale(data.labels);

            this.eachBars(function(bar, index, datasetIndex) {
                let color = this.getBarColor(bar);

                helpers.extend(bar, {
                    width: this.scale.calculateBarWidth(this.datasets.length),
                    base: (bar.prev && !bar.total) ? bar.prev.y : this.scale.calculateY(0),
                    strokeColor: color,
                    fillColor: color,
                    x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
                    y: this.scale.endPoint
                });
                bar.save();
            }, this);

            this.render();
        },

        /**
         * @param {BarClass} bar
         * @returns {number}
         */
        getBarColor: function(bar) {
            return bar.value - ((bar.prev && !bar.total) ? bar.prev.value : 0) < 0
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

            // draw all the bars for each dataset
            helpers.each(this.datasets, function (dataset, datasetIndex) {
                helpers.each(dataset.bars, function (bar, index) {
                    if (!bar.hasValue()) return;

                    let color = this.getBarColor(bar);

                    bar.strokeColor = color;
                    bar.fillColor = color;
                    bar.base = (bar.prev && !bar.total) ? bar.prev.y : this.scale.calculateY(0);

                    // transition then draw
                    bar.transition({
                        x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
                        y: this.scale.calculateY(bar.value),
                        width: this.scale.calculateBarWidth(this.datasets.length)
                    }, easingDecimal).draw();

                }, this);
            }, this);

            this.scale.draw(easingDecimal);
        }
    });
}

CreateCharts.$inject = ['ChartJs', '$filter'];

export default angular.module('app.directives.calculator-charts', [angularChart.name])
    .run(CreateCharts)
    .directive('chartAnnualCosts', ['ChartJsFactory', function (ChartJsFactory) { return new ChartJsFactory('AnnualCosts'); }])
    .directive('chartSavings', ['ChartJsFactory', function (ChartJsFactory) { return new ChartJsFactory('Savings'); }])
    .name;