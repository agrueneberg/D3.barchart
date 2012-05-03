(function (exports) {
    "use strict";

    /*global d3 */

 // Draws a barchart.
 // @param {object} data
 // @param {object} options
 // @param {DOMElement} options.parentElement The parent element of the SVG element.
 // @param {number} options.width Width of the SVG element.
 // @param {number} options.height Height of the SVG element.
 // @param {object} options.axes
 // @param {object} options.axes.y
 // @param {number} options.axes.y.padding
 // @param {number} options.axes.y.ticks
    exports.barchart = function (data, options) {

        var labels, values, parentElement, width, height, yAxisPadding, yAxisTicks,
            yMin, yMax, xScale, yScale, yAxisScale, yAxis, svg;

     // Prepare input data.
        labels = Object.keys(data);
        values = [];
        labels.forEach(function (label) {
            values.push(data[label]);
        });

     // Evaluate options and set defaults.
        options = options || {};
        parentElement = options.parentElement || document.body;
        width = options.width || 300;
        height = options.height || 300;
        if (options.hasOwnProperty("axes") && options.axes.hasOwnProperty("y") && options.axes.y.padding) {
            yAxisPadding = options.axes.y.padding;
        } else {
            yAxisPadding = 25;
        }
        if (options.hasOwnProperty("axes") && options.axes.hasOwnProperty("y") && options.axes.y.ticks) {
            yAxisTicks = options.axes.y.ticks;
        } else {
            yAxisTicks = height / 75;
        }

     // Create an ordinal scale for the x axis.
        xScale = d3.scale.ordinal()
                   .domain(labels)
                   .rangeBands([yAxisPadding, width]);

     // Create a linear scale for the y axis.
        yMin = d3.min(values);
        yMax = d3.max(values);
        yScale = d3.scale.linear()
                   .domain([yMin, yMax])
                   .range([0, height]);
        yAxisScale = d3.scale.linear()
                             .domain([yMin, yMax])
                             .range([height, 0]);

     // Create y axis.
        yAxis = d3.svg.axis()
                      .scale(yAxisScale)
                      .orient("left")
                      .ticks(yAxisTicks)
                      .tickSize(5, 0);

     // Set up the SVG element.
        svg = d3.select(parentElement)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

     // Generate y axis.
        svg.append("g")
           .attr("class", "axis")
         // Add penalty of 1 so that axis and first bar do not collide.
           .attr("transform", "translate(" + (yAxisPadding - 1) + ",0)")
           .call(yAxis);

     // Generate and append bars.
        svg.append("g")
           .selectAll("rect")
           .data(values)
           .enter()
           .append("rect")
           .attr("class", "bar")
           .attr("width", function (d, i) {
                return xScale.rangeBand();
            })
           .attr("height", function (d) {
                return yScale(d);
            })
           .attr("x", function (d, i) {
                return yAxisPadding + (xScale.rangeBand() * i);
            })
           .attr("y", function (d) {
               return height - yScale(d);
            })
           .append("title")
           .text(function (d, i) {
                return labels[i];
            });

    };

}(window));
