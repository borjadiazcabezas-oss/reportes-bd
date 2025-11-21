const turnos = [
    {
        lider: "Francisco Garcia",
        operarios: [
            { name: "Juan Carlos Ugueto", palets: 40, horas: 8 },
            { name: "Jose Gregorio Sarti", palets: 35, horas: 8 },
            { name: "Juan Jose Sarti", palets: 45, horas: 8 },
            { name: "Antonio Ramos", palets: 30, horas: 8 }
        ]
    },
    {
        lider: "Jonatan Escarraman",
        operarios: [
            { name: "Humberto Mariscal", palets: 28, horas: 8 },
            { name: "Angel Luis Torres", palets: 25, horas: 8 },
            { name: "José Pérez", palets: 30, horas: 8 }
        ]
    },
    {
        lider: "Antonio Montes",
        operarios: [
            { name: "Francisco Javier Herrera", palets: 32, horas: 8 },
            { name: "Josue Cortes", palets: 30, horas: 8 },
            { name: "Francisco Quiñones", palets: 36, horas: 8 }
        ]
    }
];

const container = document.getElementById('turnosContainer');

turnos.forEach(turno => {
    const card = document.createElement('div');
    card.classList.add('card');

    const totalTurno = turno.operarios.reduce((sum, op) => sum + op.palets, 0);
    card.innerHTML = `<h2>Turno ${turno.lider}</h2>
                      <p>Total palets: ${totalTurno}</p>`;

    const opsContainer = document.createElement('div');
    opsContainer.classList.add('opsContainer');

    turno.operarios.forEach(op => {
        const opDiv = document.createElement('div');
        opDiv.classList.add('opDiv');

        const canvas = document.createElement('canvas');
        canvas.id = `chart_${op.name.replace(/\s+/g,'')}`;
        opDiv.appendChild(canvas);

        const porcentaje = ((op.palets / totalTurno) * 100).toFixed(1);
        const label = document.createElement('p');
        label.innerText = `${op.name}\n${op.palets} palets\n${porcentaje}% turno`;
        opDiv.appendChild(label);

        opsContainer.appendChild(opDiv);

        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Palets', 'Horas restantes'],
                datasets: [{
                    data: [op.palets, op.horas*10 - op.palets],
                    backgroundColor: ['#2563eb', '#e5e7eb']
                }]
            },
            options: { 
                responsive: false, 
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } }
            }
        });
    });

    card.appendChild(opsContainer);
    container.appendChild(card);
});
