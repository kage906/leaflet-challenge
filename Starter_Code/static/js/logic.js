// Create a variable to store the earthquake data using the URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a new Leaflet map using the map id
var myMap = L.map("map", {
  center: [37.09024, -95.712891],
  zoom: 5 });

  // Add a tile layer to our map
var layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
}).addTo(myMap);

// Create a new layer group for the earthquake data and save it to a variable
var earthquakes = L.layerGroup().addTo(myMap);

// Create a function to loop through GeoJSON data and create markers for each earthquake in our selected data. 
d3.json(queryUrl).then(function(data) {
  L.geoJSON(data,{pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng,{
        radius: feature.properties.mag * 5,
        fillColor: getColorDepth(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1});},
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>" +
        "</h3><hr><p>" + "Depth: " + feature.geometry.coordinates[2] + "</p>");}
  }).addTo(earthquakes);
  
  // Define a function to obtain the color for each earthquake based on the depth of the earthquake
  function getColorDepth(depth) {
    if (depth > 90) {
      return "#FF0000";
    } else if (depth > 70) {
      return "#FF4500";
    } else if (depth > 50) {
      return "#FF8C00";
    } else if (depth > 30) {
      return "#FFA500";
    } else if (depth > 10) {
      return "#FFFF00";
    } else {
      return "#ADFF2F";}}
  
      // Make a legend to differentiate the earthquake data
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var depthMeasures = [-10, 10, 30, 50, 70, 90];
    var labels = [];
        
    // create a loop to go through each depth measure and make a label with a colored square for each range of depth measures
        for (let i = 0; i < depthMeasures.length; i++) {
            div.innerHTML +=
              '<i style="background:' + getColorDepth(depthMeasures[i] + 1) + '"></i> ' +
              depthMeasures[i] + (depthMeasures[i + 1] ? '&ndash;' + depthMeasures[i + 1] + '<br>' : '+');}
          return div;};
        
          // Add the legend to the map
        legend.addTo(myMap);});