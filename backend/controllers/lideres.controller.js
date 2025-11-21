// backend/controllers/lideres.controller.js

import ReporteLider from "../models/ReporteLider.js";
import { calcularTurno } from "../services/turno.service.js";
// import { procesarReporteLider } from "../services/produccion_lider.service.js"; // Para uso posterior

export async function guardarReporteLider(req, res) {
  try {
    const { liderUserId, raw } = req.body;

    const turno = calcularTurno();
    const now = new Date();

    const doc = await ReporteLider.create({
      liderUserId,
      receivedAt: now,
      raw,
      processed: false,
      createdAt: now
    });

    // Opcional: Ejecutar procesarReporteLider(doc._id); en un proceso asíncrono.
    
    res.json({ ok: true, reporteId: doc._id });
  }
  catch(err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
