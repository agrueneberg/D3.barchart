(function (exports) {
    "use strict";

    /*jshint curly:false */
    /*global d3 */

    exports.barchart = function () {

        var barchart, width, height, minimum, maximum, xScale, yScale, xAxisPadding,
            yAxisPadding, yAxisTicks, yAxisScale, yAxis, tooltip;

        width = 300;
        height = 300;

        xScale = d3.scale.ordinal();
        yScale = d3.scale.linear();

        xAxisPadding = 10;

        yAxisPadding = 25;
        yAxisTicks = height / 75;
        yAxisScale = d3.scale.linear();
        yAxis = d3.svg.axis()
                  .scale(yAxisScale)
                  .orient("left")
                  .ticks(yAxisTicks)
                  .tickSize(6, 0);

        tooltip = (function () {
            var body, tooltip;
            body = d3.select("body");
            tooltip = body.append("div")
                          .classed("tooltip", true);
            return {
                show: function (d) {
                    var mouse;
                    mouse = d3.mouse(body.node());
                    tooltip.style("display", "block")
                           .style("left", (mouse[0] + 25) + "px")
                           .style("top", (mouse[1] - 10) + "px")
                           .html(d);
                },
                hide: function () {
                    tooltip.style("display", "none");
                }
            };
        }());

        barchart = function (selection) {

            selection.each(function (data) {

                var labels, range, yMin, yMax, svg, template, bars, xAxis;

             // Extract labels.
                labels = d3.keys(data);

             // Convert object to array.
                data = labels.map(function (d) {
                    return [d, data[d]];
                });

             // Update padded x scale.
                xScale.domain(labels)
                      .rangeBands([yAxisPadding, width]);

             // Compute range.
                if (minimum !== undefined) {
                    yMin = minimum;
                } else {
                    yMin = d3.min(data, function (d) {
                        return d[1];
                    });
                }
                if (maximum !== undefined) {
                    yMax = maximum;
                } else {
                    yMax = d3.max(data, function (d) {
                        return d[1];
                    });
                }
                range = [minimum || yMin, maximum || yMax];

             // Update y scale.
                yScale.domain(range)
                      .range([xAxisPadding, height - xAxisPadding]);

             // Update inverted y scale for y axis.
                yAxisScale.domain(range)
                          .range([height - xAxisPadding, xAxisPadding]);

             // Generate canvas.
                svg = d3.select(this)
                        .selectAll("svg")
                        .data([data]);

             // Generate chart template.
                template = svg.enter()
                              .append("svg");
                template.append("g")
                        .attr("id", "bars");
                template.append("g")
                        .attr("id", "xAxis")
                        .classed("axis", true);
                template.append("g")
                        .attr("id", "yAxis")
                        .classed("axis", true);

             // Update dimensions.
                svg.attr("width", width)
                   .attr("height", height);

             // Generate bars.
                bars = svg.select("g#bars")
                          .selectAll("rect.bar")
                          .data(data, function (d) {
                              return d[0];
                           });

                bars.enter()
                    .append("rect")
                    .attr("class", "bar");

                bars.attr("x", function (d) {
                        return xScale(d[0]);
                     })
                    .attr("y", function (d) {
                        return ((height - xAxisPadding) - yScale(d[1])) + xAxisPadding;
                     })
                    .attr("width", function (d) {
                        return xScale.rangeBand();
                     })
                    .attr("height", function (d) {
                        return yScale(d[1]) - xAxisPadding;
                     })
                    .on("mousemove", function (d) {
                        tooltip.show(d[0]);
                     })
                    .on("mouseout", function (d) {
                        tooltip.hide();
                     });

                bars.exit()
                    .remove();

             // Generate x axis.
                xAxis = svg.select("g#xAxis")
                           .selectAll("line")
                           .data([data]);

                xAxis.enter()
                     .append("line");

                xAxis.attr("x1", yAxisPadding)
                     .attr("y1", height - xAxisPadding)
                     .attr("x2", width)
                     .attr("y2", height - xAxisPadding);

             // Generate y axis.
                svg.select("g#yAxis")
                 // Add penalty of 1 so that axis and first bar do not collide.
                   .attr("transform", "translate(" + (yAxisPadding - 1) + ",0)")
                   .call(yAxis);

            });

        };

        barchart.height = function (_) {
            if (!arguments.length) return height;
            height = _;
            return barchart;
        };

        barchart.width = function (_) {
            if (!arguments.length) return width;
            width = _;
            return barchart;
        };

        barchart.minimum = function (_) {
            if (!arguments.length) return minimum;
            minimum = _;
            return barchart;
        };

        barchart.maximum = function (_) {
            if (!arguments.length) return maximum;
            maximum = _;
            return barchart;
        };

        barchart.xAxisPadding = function (_) {
            if (!arguments.length) return xAxisPadding;
            xAxisPadding = _;
            return barchart;
        };

        barchart.yAxisPadding = function (_) {
            if (!arguments.length) return yAxisPadding;
            yAxisPadding = _;
            return barchart;
        };

        barchart.yAxisTicks = function (_) {
            if (!arguments.length) return yAxisTicks;
            yAxisTicks = _;
            return barchart;
        };

        barchart.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return barchart;
        };

        return barchart;

    };

}(window));
