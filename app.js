// read in json data file samples.json
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json'
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

let bbData;

// Fetch the JSON data and console log it
function init(){
  dataPromise.then(function(data) {
  bbData = data;
  console.log("bbData", bbData);
  // Get names 
  let names = bbData.names;

    //create a graph of one sample.  Initializes bar graph to show the first sample: 
    var sampleRow = bbData.samples[0];
    let trace = {
    type: "bar",
    orientation: "h",
    x: sampleRow.sample_values.slice(0,10).reverse(),
    y: sampleRow.otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
    text: sampleRow.otu_labels.slice(0,10).reverse()
    }
    let graphData = [trace]
    Plotly.newPlot('bar', graphData);

  // create a bubble chart of the same first sample.  Initializes bubble graph to show the first sample
  var tracebub = {
    x: sampleRow.otu_ids.reverse(),
    y: sampleRow.sample_values.reverse(),
    mode: 'markers',
    marker: {
      color: sampleRow.otu_ids.reverse(),
      size: sampleRow.sample_values.reverse()
    },
    text: sampleRow.otu_labels
  };
  
  var data = [tracebub];
  
  let blayout = {
    title: 'All OTUs on this Sample',
    height: 600,
    width: 1200,
    xaxis: {
      title: "OTU ID"
    },
    yaxis: {
      title: "Sample Value"
    }
  };
  
  Plotly.newPlot("bubble", data, blayout);

  
  //display a static table for the first sample's metadata 
  // (edit from the sample code in the plotly documentationhttps://plotly.com/javascript/table/ )
// Extract metadata for the first sample
let metadata = bbData.metadata[0];
console.log("metadata values: ", Object.values(metadata));

// // Define the data array for the table
let tableCells = [[Object.keys(metadata)], [Object.values(metadata)]];
console.log("tableCells: ", tableCells);

document.getElementById("sample-metadata").innerHTML = `id: ${metadata.id} <br> ethnicity: ${metadata.ethnicity} <br> gender: ${metadata.gender} <br> age: ${metadata.age} <br> location: ${metadata.location} <br> bbtype: ${metadata.bbtype} <br> wfreq: ${metadata.wfreq}`;

// Display a gauge of the wash frequency of the initial sample
var data = [
	{
		domain: { x: [0, 1], y: [0, 1] },
		value: metadata.wfreq,
		title: { text: "Belly Button Wash Frequency" },
		type: "indicator",
		mode: "gauge+number",
    gauge: {
      axis: { range: [null, 10] },
      steps: [
        { range: [0, 10], color: "lightgrey" },

      ],
    }
  }
	
];
var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
Plotly.newPlot('gauge', data, layout);

  // Select dropdown
let dropdown = d3.select("#selDataset");

  // Populate options
names.forEach(name => {
    dropdown.append("option")
    .text(name)
    .attr("value", name);
  });

});
}

function optionChanged(sample) {
  d3.json(url).then(function(bbData) {

  // filter function to get data from the sample row
  let sampleData = bbData.samples.filter(s => s.id === sample);
  console.log("sampleData: ", sampleData);
  //use sampleData[0] to draw plots
  let sampleRow = sampleData[0];
  console.log("sampleRow: ", sampleRow);
      // Update graph data
    let graphData = [{
      type: "bar",
      orientation: "h",
      x: sampleRow.sample_values.slice(0, 10).reverse(),
      y: sampleRow.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: sampleRow.otu_labels.slice(0,10).reverse()
  }];
  // Update the chart with the new data
  // TODO: Adjust colors on chart to a broader range 
  //and change opacity to more dense
  Plotly.newPlot('bar', graphData);

    // Update the bubble chart data
  var tracebub = {
    x: sampleRow.otu_ids.reverse(),
    y: sampleRow.sample_values.reverse(),
    mode: 'markers',
    marker: {
      color: sampleRow.otu_ids.reverse(),
      size: sampleRow.sample_values.reverse()
    },
    text: sampleRow.otu_labels
  };
  var layout = {
    title: 'All OTUs on this Sample',
    height: 600,
    width: 1200
  };
  var data = [tracebub];
  // Update the bubble chart
  Plotly.newPlot("bubble", data, layout);
//  update the metadata info
  let metadata = bbData.metadata.filter(s => s.id.toString() === sample);

  console.log("metadata after change: ", metadata);
  document.getElementById("sample-metadata").innerHTML = `id: ${metadata[0].id} 
  <br> ethnicity: ${metadata[0].ethnicity} 
  <br> gender: ${metadata[0].gender} 
  <br> age: ${metadata[0].age} 
  <br> location: ${metadata[0].location} 
  <br> bbtype: ${metadata[0].bbtype} 
  <br> wfreq: ${metadata[0].wfreq}`;

// update the wash frequency gauge
var data = [
	{
		domain: { x: [0, 1], y: [0, 1] },
		value: metadata[0].wfreq,
		title: { text: "Belly Button Wash Frequency" },
		type: "indicator",
		mode: "gauge+number",
    gauge: {
      axis: { range: [null, 10] },
      steps: [
        { range: [0, 10], color: "lightgrey" },

      ],
    }
  }
	
];
var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
Plotly.newPlot('gauge', data, layout);
})
}

init();


