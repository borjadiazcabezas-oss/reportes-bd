// backend/controllers/modelos.controller.js

import Modelo from "../models/Modelo.js";

/**
 * Obtiene todos los modelos activos para rellenar selectores.
 */
export async function getModelosActivos(req, res) {
  try {
    const modelos = await Modelo.find({ deprecated: { $ne: true } })
                                .select('_id name type');

    res.json({ ok: true, modelos });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error al obtener la lista de modelos." });
  }
}
