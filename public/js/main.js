const activityColors = {
  "Produccion":"bg-green",
  "Limpieza":"bg-yellow",
  "Averia":"bg-red",
  "Mantenimiento":"bg-blue",
  "Arreglo Palets":"bg-purple",
  "Cambio":"bg-orange",
  "OTROS":"bg-gray"
};

async function loadActivities(){
  try{
    const res = await fetch('/api/activities');
    const data = await res.json();
    renderTurnos(data);
  }catch(err){ console.error(err); }
}

function renderTurnos(data){
  const container = document.getElementById('turnos');
  container.innerHTML = '';

  // Agrupar por operario
  const byOperario = {};
  data.forEach(act=>{
    if(!byOperario[act.operario]) byOperario[act.operario]=[];
    byOperario[act.operario].push(act);
  });

  Object.entries(byOperario).forEach(([operario, acts])=>{
    const div = document.createElement('div');
    div.className='turno';
    div.innerHTML=`<h3>${operario}</h3>`;
    acts.forEach(a=>{
      const barra = document.createElement('div');
      barra.className=`activity-bar ${activityColors[a.activityType] || 'bg-gray'}`;
      barra.style.width = '100%';
      barra.title = `${a.activityType} - Palets: ${a.palets || 0}`;
      div.appendChild(barra);
    });
    container.appendChild(div);
  });
}

window.addEventListener('load', loadActivities);
