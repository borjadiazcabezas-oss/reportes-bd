// backend/services/mermas.service.js

import Merma from "../models/Merma.js";
import { logAction } from "./auditoria.service.js";

/**
 * Registra una nueva merma.
 */
export async function registrarNuevaMerma(data) {
    const doc = await Merma.create({
        ...data,
        fecha: new Date(),
        createdAt: new Date()
    });

    await logAction(data.reportadoPor, 'REGISTRO_MERMA', { mermaId: doc._id, cantidad: data.cantidad, tipo: data.tipo });
    return doc;
}
