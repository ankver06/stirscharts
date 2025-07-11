let chart;

console.log("ChartDataLabels?", typeof ChartDataLabels);
if (typeof ChartDataLabels === "undefined") {
  console.error("ChartDataLabels NOT loaded — fix <script> order or CDN link!");
}

const chartFiles = {
  outright: "euribor/outright.json",
  spread3m: "euribor/3m_spread.json",
  spread6m: "euribor/6m_spread.json",
  spread12m: "euribor/12m_spread.json",
  fly3m: "euribor/3m_fly.json",
  fly6m: "euribor/6m_fly.json",
  fly12m: "euribor/12m_fly.json",
  dfly3m: "euribor/3m_double_fly.json",
  dfly6m: "euribor/6m_double_fly.json",
  dfly12m: "euribor/12m_double_fly.json"
};

const chartColors = {
  outright: '#003366',
  spread: '#007acc',
  fly: '#009973',
  dfly: '#cc0000'
};

document.querySelectorAll('.chart-types button').forEach(btn => {
  btn.addEventListener('click', () => {
    const chartKey = btn.getAttribute('data-chart');
    const jsonFile = chartFiles[chartKey];
    if (jsonFile) {
      loadChart(`data/${jsonFile}`, chartKey);
    }
  });
});

function loadChart(filePath, chartKey) {
  console.log(`Fetching: ${filePath}`);

  fetch(filePath)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
      return response.json();
    })
    .then(data => {
      const titleEl = document.getElementById('chartTitle');
      const prettyLabel = formatLabel(chartKey);
      titleEl.textContent = `Euribor ${prettyLabel} Curve`;

      const labels = data.map(point => point.Contract);
      const values = data.map(point => point.Price);

      const ctx = document.getElementById('euriborChart').getContext('2d');

      if (chart) chart.destroy();

      const baseType = chartKey.replace(/\d+m/i, '');
      const color = chartColors[baseType] || '#003366';

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: '',
            data: values,
            borderColor: color,
            backgroundColor: color + '20',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: color,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false },
            datalabels: {
              color: ctx => ctx.dataset.data[ctx.dataIndex] < 0 ? 'red' : 'black',
              font: { weight: 'bold' },
              formatter: val => val.toFixed(1),
              anchor: 'end',
              align: 'top'
            }
          },
          interaction: { mode: 'nearest', axis: 'x', intersect: false },
          scales: {
            x: { title: { display: true, text: 'Contract' }, grid: { color: '#eee' } },
            y: { title: { display: true, text: 'Price' }, grid: { color: '#eee' } }
          }
        },
        plugins: typeof ChartDataLabels !== "undefined" ? [ChartDataLabels] : []
      });
    })
    .catch(error => console.error('Error loading Euribor data:', error));
}

function formatLabel(key) {
  if (key === 'outright') return 'Outright';
  if (key.startsWith('spread')) return `${key.match(/\d+/)}M Spread`;
  if (key.startsWith('fly')) return `${key.match(/\d+/)}M Fly`;
  if (key.startsWith('dfly')) return `${key.match(/\d+/)}M Double Fly`;
  return key;
}

// ✅ Load default
loadChart('data/euribor/outright.json', 'outright');
