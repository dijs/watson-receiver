$.getJSON('/measurements/upstairs-temperature', function(data) {
  const millisInMin = 1000 * 60;
  const pts = data.map(JSON.parse);
  const y = pts.map(pt => pt.value);
  const times = pts.map(pt => pt.timestamp);
  const x = times.map(time => (time - times[0]) / millisInMin);
  const trace = {
    x,
    y,
    type: 'scatter'
  };
  Plotly.newPlot('graph', [trace]);
});
