/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

// Search "D3 Margin Convention" on Google to understand margins.
// Add comments here in your own words to explain the margins below
var margin = {top: 10, right: 40, bottom: 150, left: 50}, // define total size of the chart
    width = 760 - margin.left - margin.right, // define the width of the inner section of the chart
    height = 500 - margin.top - margin.bottom; // define the height of the inner section of the chart
    

// Define SVG. "g" means group SVG elements together. 
// Add comments here in your own words to explain this segment of code
var svg = d3.select("body").append("svg") // select the body element tag and append an svg
    .attr("width", width + margin.left + margin.right) 
    .attr("height", height + margin.top + margin.bottom) 
    // the width of the svg is total width of the chart as defined in margin
    // the height of the svg is the total height of the chart as defined in margin
     // width and height are not the total size but the size of the inner chart
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.
// Add comments in your own words to explain the code below
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
// we set the xScale according to the width we set earlier.
// This way we no longer have to think about the margin, we can
// just think about the xScale that will scale accordingly.

var yScale = d3.scaleLinear().range([height, 0]);
// the same goes for the yScale. We set it according to the height we set earlier.
// we no longer need to think about our margins since we have a yScale that will
// scale correctly 

// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign
var xAxis = d3.axisBottom(xScale);
// we set the x Axis to be at the bottom and we use our xScale for proper placement
var yAxis = d3.axisLeft(yScale) .ticks(5, "$f");
// we do the same here with the yScale but we also set the ticks to count up by 5
// and we format the ticks with a dollar sign

/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 

// data.csv contains the country name(key) and its GDP(value)
// d.key and d.value are very important commands
// You must provide comments here to demonstrate your understanding of these commands

function rowConverter(data) { // here we set a function to properly format the data into an object
    return {
        key : data.country,
        value : +data.gdp
    }
}

d3.csv("GDP2022TrillionUSDollars.csv",rowConverter).then(function(data){ // here d3 reads the .csv
    // it also calls row converter to format the data
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    // we then set domains for x and y according to the data that was read in from the csv file
    // the domain for y is 0 to the max gdp in the csv file
    // for the xScale it is the amount of countries in the csv file.
    
    // Creating rectangular bars to represent the data. 
    // Add comments to explain the code below

    svg.selectAll("rect")
        .data(data) // pass in the data 
        .enter()
        .append("rect") // append a rect for the bar
        .transition().duration(1000) // animation for bar coming in and the time it takes
        .delay(function(d,i) {return i * 200;}) // set the delay for the next bar coming in
        .attr("x", function(d) { // set the x size
            return xScale(d.key); // scale it with the country name
        })
        .attr("y", function(d) { // set the y size
            return yScale(d.value); // scale the bar with the gdp number
        })
        .attr("width", xScale.bandwidth()) // the width of the bar 
        .attr("height", function(d) { // heigh of the bar
			 return height- yScale(d.value); // defined by the height of the graph - the yScale with the gdp
        })
        .attr("fill", function(d) { // set the color of the bar according to the the gdp value
            return "rgb(0, 0, " + (255 - Math.round(d.value * 5)) + ")"; // d.value is the gdp!
        })
        ;
        // create increasing to decreasing shade of blue as shown on the output
			   
    svg.selectAll("text") // adding text to the bar
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            return d.value; // the text is just the gdp amount
        })
        .attr("x", function(d) {
            return xScale(d.key) + 2; // position it on the bar
        })
        .attr("y", function(d) {
            return yScale(d.value) + 15; // position the text right under the top of the bar
        })
        .attr("fill", "white") // set the color of the text to white
        .attr("font-size", "15px")
        ;
    // Label the data values(d.value)
    
    
    // Draw xAxis and position the label at -60 degrees as shown on the output 
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("transform", "rotate(290)"); // rotate the text so that it doesnt jumble up
        
    // Draw yAxis
    svg.append("g")
    .attr("class", "y axis")
    .attr("text-anchor", "end")
    .attr("transform", "translate(0," - height + ")")
    .attr("dy", ".75em")

    .call(yAxis)
    ;
    svg.append("text") // lable for the Y axis
        .attr("class", "y axis")
        .attr("transform", "rotate(-90)") // rotate the text so that it is sideways
        .attr("y", 0 - 35) 
        .attr("x",0 - (height / 2))
        // the two lines above position the text around the y axis
        .style("text-anchor", "middle")
        .text("Trillions of US Dollars ($)") // The actual lable 

    
    // Draw yAxis and position the label

      
});
