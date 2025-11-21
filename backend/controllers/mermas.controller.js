// backend/controllers/mermas.controller.js

import { registrarNuevaMerma } from "../services/mermas.service.js";

export async function registrarMerma(req, res) {
  try {
    const data = req.body;
    const doc = await registrarNuevaMerma(data);

    res.json({ ok: true, message: "Merma registrada con éxito.", merma: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
