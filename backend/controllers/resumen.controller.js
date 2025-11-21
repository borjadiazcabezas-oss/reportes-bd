// backend/controllers/resumen.controller.js

import { generarResumenTurno } from "../services/resumen.services.js";

/**
 * Genera el documento de ResumenTurno bajo demanda.
 */
export async function generarResumen(req, res) {
  try {
    const { date, turno } = req.body; 

    if (!date || !turno) {
      return res.status(400).json({ ok: false, error: "Faltan date y turno." });
    }

    const resumen = await generarResumenTurno(date, parseInt(turno));

    res.json({ ok: true, message: "Resumen generado.", resumen });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
