// backend/controllers/recuperaciones.controller.js

import { registrarNuevaRecuperacion } from "../services/recuperaciones.service.js";

export async function registrarRecuperacion(req, res) {
  try {
    // Asumimos que el actorId viene en el body para la auditoría
    const { actorId, ...data } = req.body; 
    
    const doc = await registrarNuevaRecuperacion(data, actorId); 

    res.json({ ok: true, message: "Recuperación registrada con éxito.", recuperacion: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
