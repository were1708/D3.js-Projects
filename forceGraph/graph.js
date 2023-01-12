var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20); // sets color scheme for nodes!

var simulation = d3.forceSimulation() // initializes the d3 force
.force("link", d3.forceLink().id(function(d) { return d.id; })) // for showing name of node
.force("center", d3.forceCenter(width / 2, height / 2)) // sets a center force in the middle!

var stopped = false; // for keeping track of the start/button (pressed or not!)


d3.json("miserables.json", function(error, graph) { // read in the json file
  if (error) throw error;




  var link = svg.append("g") // for drawing the links between the nodes
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g") // for drawing the nodes and also applying d3 force to them!
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", function(d) {return d.strength + 2}) // set the radius with respect to the strength attribute! (new attribute)
      .attr("fill", function(d) { return color(d.group); }) // color the nodes!
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
          // these 3 .on functions are for draggin and dropping nodes!

  node.append("title") // name of the nodes!
      .text(function(d) { return d.id; });

  simulation // apply new force attributes! set thing with respect to new attribute d.strength
    .force("collide", d3.forceCollide(function(d){return d.strength + 2}).strength(1.5)) // sets collision radious
    .force("charge", d3.forceManyBody().strength(function(d){return -d.strength * 2 -50}))
    .force("x", d3.forceX().strength(-.02))
    .force("y", d3.forceY().strength(-.02))
  
  simulation // attributes for nodes
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link") // attributes for links!
      .links(graph.links)
      .strength(1 / 3)
      .distance(50);

  function ticked() { // function for each "tick" within the force instance (unit of time)
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
  

});

function stop() { // for start/stop button
  if (!stopped) {simulation.stop(); stopped = true}
  else {simulation.restart(); stopped = false}
}


function dragstarted(d) { 
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  stopped = false
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  stopped = false
  d.fx = d.x;
  d.fy = d.y;
  // makes sure the drag and drop has fixed position
}
