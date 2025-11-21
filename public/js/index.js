// Datos de ejemplo
const turnos = ["Francisco Garcia", "Jonatan Escarraman", "Antonio Montes"];
const palets = [120, 95, 110];
const productividad = [80, 75, 85]; // % de productividad

// Turnos Chart
const ctxTurnos = document.getElementById('turnosChart').getContext('2d');
new Chart(ctxTurnos, {
    type: 'bar',
    data: {
        labels: turnos,
        datasets: [{
            label: 'Palets producidos',
            data: palets,
            backgroundColor: ['#2563eb', '#10b981', '#f59e0b']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// Productividad Chart
const ctxProd = document.getElementById('productividadChart').getContext('2d');
new Chart(ctxProd, {
    type: 'line',
    data: {
        labels: turnos,
        datasets: [{
            label: 'Productividad %',
            data: productividad,
            borderColor: '#ef4444',
            fill: false,
            tension: 0.3,
            pointBackgroundColor: '#ef4444'
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    }
});
