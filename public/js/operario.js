// public/js/operario.js

// ---------------------------------------------------
// INTEGRACIÓN CON LOGIN (Carga de datos del usuario)
// ---------------------------------------------------
let USER_DATA = null;
let OPERATOR_NAME = "Operario Desconocido";
let OPERATOR_CODE = "N/A"; // Usaremos el userId

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar datos del usuario desde la sesión (localStorage)
    const storedData = localStorage.getItem('userData');
    if (storedData) {
        USER_DATA = JSON.parse(storedData);
        OPERATOR_NAME = USER_DATA.nombre;
        OPERATOR_CODE = USER_DATA.userId; // userId es el código único
        
        // Actualizar el nombre del operario en la cabecera
        document.getElementById("operator-name").textContent =
            `${OPERATOR_NAME} (${OPERATOR_CODE})`;
        
        // Inicializar la interfaz
        renderActivityButtons();
        updateState();

    } else {
        // Redirigir si no hay sesión
        alert('Sesión expirada o no iniciada. Redirigiendo a Login.');
        window.location.href = 'index.html'; 
    }
});


//---------------------------------------------------
// ACTIVIDADES (Tu configuración original)
//---------------------------------------------------
const activityTypes = [
    { type: 'Produccion',       color: 'bg-green-600' },
    { type: 'Limpieza',         color: 'bg-yellow-600' },
    { type: 'Averia',           color: 'bg-red-600' },
    { type: 'Mantenimiento',    color: 'bg-blue-600' },
    { type: 'Arreglo Palets',   color: 'bg-purple-600' },
    { type: 'Cambio',           color: 'bg-orange-600' },
    { type: 'OTROS',            color: 'bg-gray-600' }
];

let currentActivity = null;
let timerInterval = null;
let activitiesHistory = [];

//---------------------------------------------------
// FUNCIONES DE TIEMPO (Tu lógica original)
//---------------------------------------------------
const pad = n => String(n).padStart(2,'0');

function formatDuration(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

function updateTimerDisplay() {
    if (!currentActivity) return;
    const ms = Date.now() - currentActivity.startTime;
    document.getElementById("timer-box").textContent = formatDuration(ms);
}

//---------------------------------------------------
function renderActivityButtons() {
    const container = document.getElementById("activity-buttons");
    container.innerHTML = "";

    activityTypes.forEach(a => {
        const btn = document.createElement("button");
        btn.className = `action-button p-3 rounded text-white font-bold ${a.color}`;
        btn.textContent = a.type;
        btn.onclick = () => {
            if (currentActivity) {
                if (currentActivity.name === a.type) {
                    window.promptForComment("stop");
                } else {
                    stopActivity().then(() => window.promptForComment("start", a.type));
                }
            } else {
                window.promptForComment("start", a.type);
            }
        };
        container.appendChild(btn);
    });
}

//---------------------------------------------------
// FUNCIÓN DE INICIO DE ACTIVIDAD (ACTUALIZADA)
//---------------------------------------------------
async function startActivity(type, comment="") {
    if (!USER_DATA) return alert("Error de sesión. Recargue la página.");

    currentActivity = {
        name: type,
        startTime: Date.now(),
        startComment: comment
    };

    updateState();

    // ➡️ CAMBIO CLAVE: Nuevo endpoint modular
    await fetch("/api/actividades/registro", { 
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
            userId: OPERATOR_CODE, 
            activityType: type,
            startTime: new Date(currentActivity.startTime).toISOString(), // Usamos formato ISO
            startComment: comment,
            // endTime y durationMs se omiten para un registro de inicio
        })
    });
}

//---------------------------------------------------
// FUNCIÓN DE FIN DE ACTIVIDAD (ACTUALIZADA)
//---------------------------------------------------
async function stopActivity(comment="") {
    if (!currentActivity || !USER_DATA) return;

    const end = Date.now();

    const record = {
        userId: OPERATOR_CODE,
        activityType: currentActivity.name,
        startTime: currentActivity.startTime,
        endTime: end,
        durationMs: end - currentActivity.startTime,
        startComment: currentActivity.startComment || "",
        endComment: comment
    };

    activitiesHistory.unshift(record);
    currentActivity = null;

    updateState();

    // ➡️ CAMBIO CLAVE: Nuevo endpoint modular
    await fetch("/api/actividades/registro", { 
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
            userId: record.userId,
            activityType: record.activityType,
            startTime: new Date(record.startTime).toISOString(),
            endTime: new Date(record.endTime).toISOString(),
            durationMs: record.durationMs,
            startComment: record.startComment,
            endComment: record.endComment,
        })
    });
}

//---------------------------------------------------
// FUNCIONES DE ESTADO Y MODAL (Tu lógica original)
//---------------------------------------------------
function renderHistory() {
    const box = document.getElementById("history-list");
    box.innerHTML = "";

    if (activitiesHistory.length === 0) {
        document.getElementById("empty-history-message").classList.remove("hidden");
        return;
    }

    document.getElementById("empty-history-message").classList.add("hidden");

    activitiesHistory.forEach(a => {
        const item = document.createElement("div");
        item.className = "p-3 border rounded bg-white shadow";

        item.innerHTML = `
            <strong>${a.activityType}</strong><br>
            Inicio: ${new Date(a.startTime).toLocaleString("es-ES")}<br>
            Fin: ${new Date(a.endTime).toLocaleString("es-ES")}<br>
            Duración: <strong>${formatDuration(a.durationMs)}</strong><br>
            ${a.startComment ? `<em>Inicio: ${a.startComment}</em><br>` : ""}
            ${a.endComment ? `<em>Fin: ${a.endComment}</em>` : ""}
        `;

        box.appendChild(item);
    });
}

function updateState() {
    document.getElementById("current-activity-name").textContent =
        currentActivity ? currentActivity.name : "Ninguna actividad en curso";

    const stopButton = document.getElementById("stop-button");
    if (currentActivity) {
        stopButton.onclick = () => window.promptForComment('stop'); 
        stopButton.classList.remove("hidden");
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimerDisplay, 1000);
    } else {
        stopButton.classList.add("hidden");
        clearInterval(timerInterval);
        document.getElementById("timer-box").textContent = "00:00:00";
    }

    renderHistory();
}

// Funciones modales globales (mantienen tu lógica original)
window.promptForComment = function(action, type=null) {
    if (!USER_DATA) return alert("Error de sesión. Recargue la página.");
    document.getElementById("comment-input").value = "";
    document.getElementById("modal-action-type").value = action;
    document.getElementById("modal-activity-type").value = type || "";

    const title = action === "start"
        ? `Comentario de inicio – ${type}`
        : "Comentario de fin";

    document.getElementById("comment-modal-title").textContent = title;
    document.getElementById("comment-modal").classList.remove("hidden");
};

window.closeCommentModal = function(omit) {
    const comment = omit ? "" : document.getElementById("comment-input").value;
    const action = document.getElementById("modal-action-type").value;
    const type = document.getElementById("modal-activity-type").value;

    document.getElementById("comment-modal").classList.add("hidden");

    if (action === "start") startActivity(type, comment);
    else stopActivity(comment);
};

window.clearAllData = function() {
    if (!confirm("¿Seguro que deseas borrar el historial LOCAL? Esto no afecta a la base de datos.")) return;
    activitiesHistory = [];
    currentActivity = null;
    updateState();
};