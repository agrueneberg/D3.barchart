(function (exports) {
    "use strict";

    /*jshint curly:false */
    /*global d3 */

    exports.barchart = function () {

        var barchart, width, height, minimum, maximum, xScale, yScale, yAxisPadding,
            yAxisTicks, yAxisScale, yAxis, tooltip;

        width = 300;
        height = 300;

        xScale = d3.scale.ordinal();
        yScale = d3.scale.linear();

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
                          .style("display", "none")
                          .style("position", "absolute")
                          .style("padding", "5px")
                          .style("background-color", "rgba(242, 242, 242, .6)")
            return {
                show: function (d) {
                    var mouse;
                    mouse = d3.mouse(body.node());
                    tooltip.style("display", null)
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

                var labels, range, yMin, yMax, svg;

             // Extract labels.
                labels = d3.keys(data);

             // Convert object to array.
                data = d3.keys(data).map(function (d) {
                    return [d, data[d]];
                });

             // Update padded x scale.
                xScale.domain(labels)
                      .rangeBands([yAxisPadding, width]);

             // Compute range.
                yMin = d3.min(data, function (d) {
                    return d[1];
                });
                yMax = d3.max(data, function (d) {
                    return d[1];
                });
                if (minimum !== undefined && maximum !== undefined) {
                    range = [minimum, maximum];
                } else if (maximum !== undefined) {
                    range = [yMin, maximum];
                } else if (minimum !== undefined) {
                    range = [minimum, yMax];
                } else {
                    range = [yMin, yMax];
                }

             // Update y scale.
                yScale.domain(range)
                      .range([0, height]);

             // Update inverted y scale for y axis.
                yAxisScale.domain(range)
                          .range([height, 0]);

             // Select existing SVG elements.
                svg = d3.select(this)
                        .selectAll("svg")
                        .data([data]) // Trick to create only one svg element for each data set.

             // Create non-existing SVG elements.
                svg.enter()
                   .append("svg");

             // Update both existing and newly created SVG elements.
                svg.attr("width", width)
                   .attr("height", height);

             // Generate custom x axis.
                svg.append("g")
                   .attr("class", "axis")
                   .append("line")
                   .attr("x1", yAxisPadding)
                   .attr("y1", height)
                   .attr("x2", width)
                   .attr("y2", height);

             // Generate y axis.
                svg.append("g")
                   .attr("class", "axis")
                 // Add penalty of 1 so that axis and first bar do not collide.
                   .attr("transform", "translate(" + (yAxisPadding - 1) + ",0)")
                   .call(yAxis);

             // Generate bars.
                svg.append("g")
                   .selectAll("rect")
                   .data(data)
                   .enter()
                   .append("rect")
                   .attr("class", "bar")
                   .attr("x", function (d) {
                        return xScale(d[0]);
                    })
                   .attr("y", function (d) {
                       return height - yScale(d[1]);
                    })
                   .attr("width", function (d) {
                        return xScale.rangeBand();
                    })
                   .attr("height", function (d) {
                        return yScale(d[1]);
                    })
                   .on("mousemove", function (d) {
                       tooltip.show(d[0]);
                    })
                   .on("mouseout", function (d) {
                       tooltip.hide();
                    });

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
