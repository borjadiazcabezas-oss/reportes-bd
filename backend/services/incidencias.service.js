// backend/services/incidencias.service.js

import Incidencia from "../models/Incidencia.js";
import { logAction } from "./auditoria.service.js";

/**
 * Crea y registra una nueva incidencia en la base de datos.
 */
export async function crearNuevaIncidencia(data) {
    const doc = await Incidencia.create({
        ...data,
        status: 'abierta',
        reportedAt: new Date(),
        createdAt: new Date()
    });
    
    await logAction(data.reportedBy, 'REGISTRO_INCIDENCIA', { incidenciaId: doc._id, type: data.type });
    return doc;
}
