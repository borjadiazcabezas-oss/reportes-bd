// backend/controllers/incidencias.controller.js

import { crearNuevaIncidencia } from "../services/incidencias.service.js";

export async function registrarIncidencia(req, res) {
  try {
    const data = req.body; 
    const doc = await crearNuevaIncidencia(data);

    res.json({ ok: true, message: "Incidencia registrada con éxito.", incidencia: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
