// backend/controllers/actividades.controller.js

import Actividad from "../models/ActividadOperario.js";
import { calcularTurno } from "../services/turno.service.js";
import { getLeaderOfUser } from "../services/empleados.service.js";

export async function registrarActividad(req, res) {
  try {
    const { userId, activityType, startTime, endTime, startComment, endComment } = req.body;

    const turno = calcularTurno(new Date(startTime));
    const leader = await getLeaderOfUser(userId); // Se usa para lógica de notificaciones, etc.

    const doc = await Actividad.create({
      userId,
      activityType,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      durationMs: endTime ? new Date(endTime) - new Date(startTime) : null,
      startComment: startComment ?? null,
      endComment: endComment ?? null,
      turno,
      operarioNombre: null, // Asume que el nombre se obtiene en el frontend o se rellena aquí
      synced: false,
      createdAt: new Date()
    });

    res.json({ ok: true, actividad: doc });
  } catch(err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
