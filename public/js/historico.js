const ctx = document.getElementById('historicoChart').getContext('2d');

// Datos de ejemplo para 3 turnos, 4 semanas
const labels = ['Semana 1','Semana 2','Semana 3','Semana 4'];
const datasets = [
    {
        label: 'Francisco Garcia',
        data: [120, 130, 110, 125],
        backgroundColor: '#2563eb'
    },
    {
        label: 'Jonatan Escarraman',
        data: [95, 100, 90, 105],
        backgroundColor: '#10b981'
    },
    {
        label: 'Antonio Montes',
        data: [110, 115, 120, 110],
        backgroundColor: '#f59e0b'
    }
];

new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
    }
});
