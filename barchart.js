(function (exports) {
    "use strict";

    /*global d3 */

 // Draws a barchart.
 // @param {object} data
 // @param {object} options
 // @param {DOMElement} options.parentElement The parent element of the SVG element.
 // @param {number} options.width Width of the SVG element.
 // @param {number} options.height Height of the SVG element.
    exports.barchart = function (data, options) {

        var labels, values, parentElement, width, height, yMin, yMax, yScale, barWidth, svg;

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

     // Create a padded linear scale for the y axis.
        yMin = d3.min(values);
        yMax = d3.max(values);
        yScale = d3.scale.linear()
                   .domain([yMin, yMax])
                   .range([0, height]);

     // Capture the basics.
        barWidth = width / labels.length;

     // Set up the SVG element.
        svg = d3.select(parentElement)
                .append("svg:svg")
                .attr("width", width)
                .attr("height", height);

     // Generate and append bars.
        svg.append("svg:g")
           .selectAll("rect")
           .data(values)
           .enter()
           .append("rect")
           .attr("class", "bar")
           .attr("width", function (d, i) {
                return barWidth;
            })
           .attr("height", function (d) {
                return yScale(d);
            })
           .attr("x", function (d, i) {
                return barWidth * i;
            })
           .attr("y", height)
           .attr("transform", function (d, i) {
                return "rotate(180," + (barWidth * i) + "," + height + ")";
            })
           .append("svg:title")
           .text(function (d, i) {
                return labels[i] + ": " + d;
            });

    };

}(window));
