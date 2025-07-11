// Fetch Intermarket SOFR vs Euribor 3M Spread JSON and draw chart
fetch('data/intermarket-sofr-euribor-3m.json')
  .then(response => response.json())
  .then(data => {
    const labels = data.map(d => d.Date || d.date);
    const spreads = data.map(d => d.Spread || d.spread);
    drawLineChart('intermarketChart', labels, spreads, 'SOFR vs Euribor 3M Spread');
  })
  .catch(error => console.error('Error loading Intermarket data:', error));
