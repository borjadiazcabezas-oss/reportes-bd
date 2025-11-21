// backend/services/auditoria.service.js

import Auditoria from "../models/Auditoria.js";

/**
 * Registra una acción de usuario en la colección de auditoría.
 */
export async function logAction(actor, action, details) {
  try {
    await Auditoria.create({
      actor,
      action,
      at: new Date(),
      details: details,
    });
  } catch (err) {
    console.error(`ERROR al escribir en auditoría (${action} por ${actor}):`, err.message);
  }
}
