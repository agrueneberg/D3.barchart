(function (exports) {
    "use strict";

    /*jshint curly:false */
    /*global d3 */

    exports.barchart = function () {

        var barchart, width, height, yAxisPadding, yAxisTicks,
            xScale, yScale, yInverseScale, xAxis, yAxis;

        width = 300;
        height = 300;

        xScale = d3.scale.ordinal();

        yAxisPadding = 25;
        yAxisTicks = height / 75;
        yScale = d3.scale.linear();
        yInverseScale = d3.scale.linear();

        yAxis = d3.svg.axis()
                  .scale(yInverseScale)
                  .orient("left")
                  .ticks(yAxisTicks)
                  .tickSize(6, 0);

        barchart = function (selection) {

            selection.each(function (data) {

                var labels, yMin, yMax, svg, enter, group;

             // Extract labels.
                labels = d3.keys(data);

             // Convert object to array.
                data = d3.keys(data).map(function (d) {
                    return [d, data[d]];
                });

             // Update padded x scale.
                xScale.domain(labels)
                      .rangeBands([yAxisPadding, width]);

             // Update padded y scale.
                yMin = d3.min(data, function (d) {
                    return d[1];
                });
                yMax = d3.max(data, function (d) {
                    return d[1];
                });
                yScale.domain([yMin, yMax])
                      .range([0, height]);
                yInverseScale.domain([yMin, yMax])
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
                   .attr("width", function (d) {
                        return xScale.rangeBand();
                    })
                   .attr("height", function (d) {
                        return yScale(d[1]);
                    })
                   .attr("x", function (d) {
                        return xScale(d[0]);
                    })
                   .attr("y", function (d) {
                       return height - yScale(d[1]);
                    })
                   .append("title")
                   .text(function (d) {
                        return d[0];
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

        return barchart;

    };

}(window));
