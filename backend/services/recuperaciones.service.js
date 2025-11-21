// backend/services/recuperaciones.service.js

import Recuperacion from "../models/Recuperacion.js";
import { logAction } from "./auditoria.service.js";

/**
 * Registra una nueva recuperación.
 */
export async function registrarNuevaRecuperacion(data, actorId) {
    const doc = await Recuperacion.create({
        ...data,
        fecha: new Date(),
        createdAt: new Date()
    });

    await logAction(actorId, 'REGISTRO_RECUPERACION', { recuperacionId: doc._id, cantidad: data.cantidad, tipo: data.tipo });
    return doc;
}
