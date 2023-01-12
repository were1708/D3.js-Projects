    function rowConverter(data) { // formats the data being read
        return {
            country: data.country, 
            gdp: data.gdp,
            population: data.population,
            ecc: data.ecc,
            epc: data.ec 
        }
    }

    //Define Margin
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    //Define SVG
      var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // define the div for the tooltip
    var div = d3.select("body")
    .append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    
    // //Define Tooltip here
    
      
       //Define Axis

    
    //Get Data
    // Define domain for xScale and yScale
    
    d3.csv("scatterdata.csv",rowConverter).then(function(data){ // reads in the data
    console.log(data);
    var gdps = []; // empty array for gdp values
    // console.log(gdps);
    var eccs = []; // empty array for ecc values
    // console.log(epcs);
    for (x of data) { // loop through all the rows
        gdps.push(parseInt(x.gdp)) // append the gdp
        eccs.push(parseInt(x.ecc)) // append the ecc
    }

        //Define Scales   
    var xScale = d3.scaleLinear()
    .domain([0, d3.max(gdps) + 3]) // defines the domain by finding the max of the gdps
    .range([0, width]);

    var yScale = d3.scaleLinear()
    .domain([0,d3.max(eccs) + 50]) // defines the domain by finding the max of eccs
    .range([height, 0]);

    //Draw Scatterplot
      var view = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return (d.epc * .5) + 1}) // we add one for readability (small values were too small)
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.ecc);})
        .style("fill", function (d) { return colors(d.country); })
        .on("mouseover", function(d) { // mouse over for tool tip
            div.transition()
            .duration(200)
            .style("opacity", .9) // makes the div visible 
            
            
            div.html( // html for the tool tip
            "<table>" + "<td colspan = 3 style = 'text-align:center'>" + d.country + "</td>" + " </tr>" 
            + "<tr>" + "<td style = 'text-align:left'>" + 'Population' + "</td>" +
            "<td style = 'text-align:center'>" + ':' + "</td>" + 
            "<td style = 'text-align:right'>" + d.population + " Million" + "</td>" + "</tr>" 
            + "<tr>" + "<td style = 'text-align:left'>" + 'GDP' + "</td>" +
            "<td style = 'text-align:center'>" + ':' + "</td>" + 
            "<td style = 'text-align:right'>" + "$" + d.gdp + " Trillion" + "</td>" + "</tr>" 
            + "<tr>" + "<td style = 'text-align:left'>" + 'ECC' + "</td>" +
            "<td style = 'text-align:center'>" + ':' + "</td>" + 
            "<td style = 'text-align:right'>" + d.ecc + " Million BTUs" + "</td>" + "</tr>"
            )
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) { // when the mouse leaves the country entry
         div.transition()		
         .duration(500)		
         .style("opacity", 0); // this hides the div            
        });




        var xAxis = d3.axisBottom(xScale).tickPadding(2);
        var yAxis = d3.axisLeft(yScale).tickPadding(2).ticks(9);
        // the two lines above set the axis for the graph
        
    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom
    var zoom = d3.zoom()
    .scaleExtent([.5, 32])
    .on("zoom", zoomed);


    //Draw Country Names
       var names = svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.ecc);})
        // these lines position the text
        .style("fill", "black")
        .text(function (d) {return d.country; });

 //x-axis
    var gX = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

        svg.append("text")
        .attr("class", "x label")
        .attr("y", height + 30)
        .attr("x", width/2)
        // these lines position the label
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("GDP (in Trillion US Dollars) in 2010");


    
    //Y-axis
    var gY = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        svg.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        // these lines position the label
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Energy Consumption per Capita (in Million BTUs per person)");


    // starts drawing the legend
    var legend = svg.append("rect") 
    .attr("x", width - 225)
    .attr("y", (height / 2) - 10)
    .style("fill", "lightgray")
    .attr("width", 220)
    .attr("height", 200);
    svg.append("text")
    .attr("x", width - 222)
    .attr("y", (height / 1.05))
    .attr("font-size", "18px")
    .style("fill", "darkgreen")
    .text("Total Energy Consumption");

    // circles for the legend!
    svg.append("circle")
    .attr("r", 51)
    .attr("cx", width - 70)
    .attr("cy", height - 150)
    .style("fill", "white")
    svg.append("circle")
    .attr("r", 6)
    .attr("cx", width - 70)
    .attr("cy", height - 80)
    .style("fill", "white")
    svg.append("circle")
    .attr("r", 1.50)
    .attr("cx", width - 70)
    .attr("cy", height - 55)
    .style("fill", "white")

    // text for the legend!
    svg.append("text")
    .attr("x", width - 223)
    .attr("y", (height - 148))
    .attr("font-size", "13px")
    .style("fill", "darkgreen")
    .text("100 Trillion BTUs");

    svg.append("text")
    .attr("x", width - 210)
    .attr("y", (height - 76))
    .attr("font-size", "13px")
    .style("fill", "darkgreen")
    .text("10 Trillion BTUs");

    svg.append("text")
    .attr("x", width - 190)
    .attr("y", (height - 50))
    .attr("font-size", "13px")
    .style("fill", "darkgreen")
    .text("1 Trillion BTUs");

    svg.call(zoom);

    

    function zoomed() {
        view.attr("transform", d3.event.transform); // moves the circles
        names.attr("transform", d3.event.transform); // moves the names of the countries
        gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale))); // scales the x axis while zooming and moving
        gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale))); // scales the y axis while zooming and moving
      }
});
