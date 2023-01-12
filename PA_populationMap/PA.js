
 var svg = d3.select("svg"),
 width = +svg.attr("width"),
 height = +svg.attr("height");

var projection = d3.geoAlbersUsa()
 .translate([-1790, 890]) // zooms into the State 
 .scale([9000]); // sets the zoom on the map!

var path = d3.geoPath().projection(projection);

// Color schemes
var color1 = d3.scaleThreshold()
 .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
 .range(d3.schemeGreens[9]);

var color2 = d3.scaleThreshold()
 .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
 .range(d3.schemeBlues[9]);

// These functions fetch data from the CSV file by checking ID
var FindDensityID = d3.map();
var FindNameID = d3.map();

var x = d3.scaleSqrt()
 .domain([0, 4500])
 .rangeRound([440, 950]);

var g = svg.append("g")
 .attr("class", "key")
 .attr("transform", "translate(0,40)");

// This represents the legend (first color scheme)
var legend1 = g.selectAll("rect1")
.data(color1.range().map(function(d) {
   d = color1.invertExtent(d);
   if (d[0] == null) d[0] = x.domain()[0];
   if (d[1] == null) d[1] = x.domain()[1];
   return d;
 }))
.enter().append("rect")
 .attr("height", 8)
 .attr("x", function(d) { return x(d[0]); })
 .attr("width", function(d) { return x(d[1]) - x(d[0]); })
 .attr("fill", function(d) { return color1(d[0]); });

// This represents the legend (second color scheme)
var legend2 = g.selectAll("rect2")
.data(color2.range().map(function(d) {
   d = color2.invertExtent(d);
   if (d[0] == null) d[0] = x.domain()[0];
   if (d[1] == null) d[1] = x.domain()[1];
   return d;
 }))
.enter().append("rect")
 .attr("height", 8)
 .attr("x", function(d) { return x(d[0]); })
 .attr("width", function(d) { return x(d[1]) - x(d[0]); })
 .attr("fill", function(d) { return color2(d[0]); })
 .style("opacity", 0);

g.append("text") // caption for legend!
 .attr("class", "caption")
 .attr("x", x.range()[0])
 .attr("y", -6)
 .attr("fill", "#000")
 .attr("text-anchor", "start")
 .attr("font-weight", "bold")
 .text("Population per square mile");

// Adds ticks for the legend!
g.call(d3.axisBottom(x)
 .tickSize(13)
 .tickValues(color1.domain()))
.select(".domain")
 .remove();

// Here we open the two data files!
d3.queue()
.defer(d3.json, "us-10m.json")
.defer(d3.csv, "Population-Density By County.csv", function(d) { FindDensityID.set(d.id, +d.density);
FindNameID.set(d.id, d.name); })
.await(ready); // we read the data!
 
function ready(error, mass) {
 if (error) throw error;

 // we need to color the county based on the density! (color1)
 var fill1 = svg.append("g").selectAll("path")
    .data(topojson.feature(mass, mass.objects.counties).features.filter(function(d) {
     return FindDensityID.get(d.id) }))
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", function(d) { return color1(FindDensityID.get(d.id)); });
 
 // we need to color the county based on the density! (color1)
 var fill2 = svg.append("g").selectAll("path")
    .data(topojson.feature(mass, mass.objects.counties).features.filter(function(d) {
     return FindDensityID.get(d.id) }))
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", function(d) { return color2(FindDensityID.get(d.id)); })
    .style("opacity", 0)
    
    //tool tip on mouse!
     .on("mousemove", function(d) {
     d3.select("#tooltip")
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 50) + "px")
         d3.select("#county")
         .text(FindNameID.get(d.id))
         d3.select("#density")
         .text(FindDensityID.get(d.id))
         d3.select("#tooltip").classed("hidden", false); // make the tooltip not hidden
     })
     .on("mouseout", function(d) {
         d3.select("#tooltip").classed("hidden", true); // make the tooltip hidden on mouseout
     });;
 
 // Draw county borders, but we need to do it for each color scheme (color 1)
 var borders1 = fill1
     .data(topojson.feature(mass, mass.objects.counties).features.filter(function(d) {
     return FindDensityID.get(d.id) }))
     .attr("fill", "none")
     .attr("stroke", "#000")
     .attr("stroke-opacity", 0.3)
     .attr("d", path);
 
 // Draw county borders, but we need to do it for each color scheme (color 2)
 var borders2 = fill2
     .data(topojson.feature(mass, mass.objects.counties).features.filter(function(d) {
     return FindDensityID.get(d.id) }))
     .attr("fill", "none")
     .attr("stroke", "#000")
     .attr("stroke-opacity", 0.3)
     .attr("d", path);
 
 // Buttons for toggling borders
 d3.select("#borders")
   .on("click", function() {
       if (borders1.attr("stroke") == "none") {
           borders1.attr("stroke", "#000");
           borders2.attr("stroke", "#000");
       } else {
           borders1.attr("stroke", "none");
           borders2.attr("stroke", "none");
       }
   });
 // button for toggling color!
 d3.select("#color")
   .on("click", function() {
       if (legend1.style("opacity") == 0) {
           legend1.style("opacity", 1);
           fill1.style("opacity", 1);
           legend2.style("opacity", 0);
           fill2.style("opacity", 0);
       } else {
           legend1.style("opacity", 0);
           fill1.style("opacity", 0);
           legend2.style("opacity", 1);
           fill2.style("opacity", 1);
       }
   });
 
};

