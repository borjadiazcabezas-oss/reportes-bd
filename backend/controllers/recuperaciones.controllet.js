// backend/controllers/recuperaciones.controller.js

import { registrarNuevaRecuperacion } from "../services/recuperaciones.service.js";

export async function registrarRecuperacion(req, res) {
  try {
    // Asumimos que el userId del actor viene en el body
    const { actorId, ...data } = req.body; 
    
    // Aquí usamos actorId para la auditoría, y el resto del body para la creación
    const doc = await registrarNuevaRecuperacion(data, actorId); 

    res.json({ ok: true, message: "Recuperación registrada con éxito.", recuperacion: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}