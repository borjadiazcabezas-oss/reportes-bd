import Actividad from "../models/ActividadOperario.js";
import Produccion from "../models/ProduccionLider.js";
import ResumenTurno from "../models/ResumenTurno.js";

export async function generarResumenTurno(dateStr, turno) {
  const actividades = await Actividad.find({ fecha: dateStr, turno });
  const produccion = await Produccion.find({ fecha: dateStr, turno });

  // horas reales
  const totalHoras = actividades.reduce((acc, a) => acc + (a.durationMs ?? 0), 0) / (1000*60*60);

  // palets
  const palets = produccion.reduce((acc, p) => acc + p.palets, 0);

  // productividad
  const productividad_relativa = palets / 2500;
  const productividad_real = palets / totalHoras;

  return ResumenTurno.create({
    date: dateStr,
    turno,
    palets_totales: palets,
    horas_productivas: totalHoras,
    productividad_relativa,
    productividad_real,
    generatedAt: new Date()
  });
}
