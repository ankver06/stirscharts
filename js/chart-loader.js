// Generic reusable function for line charts
function drawLineChart(canvasId, labels, data, labelName) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: labelName,
        data: data,
        borderColor: 'blue',
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true
    }
  });
}
