
var svg = d3.select("svg") // selects svg from html page
margin = {top: 20, right: 300, bottom: 30, left: 50}, // sets margins up for the graph
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
// sets width and height for graph
g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y"); // set up the format for the time parser

var x = d3.scaleTime() // set x scale with respect to width
    .rangeRound([0, width])


var y = d3.scaleLinear() // set y scale with respect to height
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal(d3.schemeCategory10); // set color scheme

// gridlines in x axis function from: https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
function make_x_gridlines() {		
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function from: https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5)
}

var line = d3.line() // set the line function's parameters 
    .curve(d3.curveBasis)
    .x(function(d) {return x(d.year); })
    .y(function(d) { return y(d.energy); });

d3.csv("BRICSdata.csv", type, function(error, data) { // read in data
    if (error) throw error;
  
      
    var countries = data.columns.slice(1).map(function(id) { // grab all country names 
      return {
        id: id, // set id to id (country name)
        values: data.map(function(d) { // format values into the year and how much energy was used
          return {year: parseTime(d.Year), energy: parseFloat(d[id])}; 
        // turn energy into a floating point and the year into a date type
        })
      };
    });
    console.log(countries)
    console.log(data)
    // console.log(data.coloumns)
    // console.log(data.length)
    // console.log(data.columns.slice(1))
    // console.log(data.columns.slice(1).map(function(dummy){return dummy.toUpperCase();}))
    // console.log(data.columns.slice(1).map(function(c){return c}));
    // console.log(d3.extent(data, function(d) { return d.Year; }));

    x.domain(d3.extent(data, function(d) {return parseTime(d.Year); })); 
    // set x domain to the smallest and largest value in years

    console.log(d3.extent(data, function(d) {return parseInt(d.Year); }))
  y.domain([ // set y domain to smallest and largest values in energy
    d3.min(countries, function(c) { return d3.min(c.values, function(d) { return d.energy; }); }),
    d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.energy; }); })
  ]);

// console.log(countries.map(function(c) {return c.id;}));
  z.domain(countries.map(function(c) { return c.id; })); // set z domain by country names
  
    // add the X gridlines from: https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
g.append("g")			
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-height - 75)
        .tickFormat("")
    )

// add the Y gridlines from: https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
g.append("g")			
    .attr("class", "grid")
    .call(make_y_gridlines()
        .tickSize(-width - 75)
        .tickFormat("")
    )

  g.append("g") // draws the x axis and moves it to bottom
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

  g.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width + 50)
    .attr("y", height + 10)
    .text("year");
    

  g.append("g") // moves and draws y axis and sets lable
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -169)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .style("font", "13px sans-serif")
      .text("Million BTUs Per Person");


  
  var country = g.selectAll(".country") // selects all countries in countries
    .data(countries)
    .enter().append("g")
      .attr("class", "country");

// console.log(country)

    
var path =  country.append("path") // sets up line to be drawn
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });



var totalLength = path.node().getTotalLength(); // for animating the line
console.log(totalLength)

path // these attributes define the line drawing animation
.attr("stroke-dasharray", totalLength + " " + totalLength)
.attr("stroke-dashoffset", totalLength)
.transition()
.duration(2000)
.attr("stroke-dashoffset", 0);

  country.append("text") // draws text (country name) at the end of the line
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.energy) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
});

function type(d, _, columns) {
  d.year = parseTime(d.Year);
  console.log(d.year);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}

