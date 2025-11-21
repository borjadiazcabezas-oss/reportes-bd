// backend/services/sincronizacion.service.js

import Sincronizacion from "../models/Sincronizacion.js";

/**
 * Inicia un nuevo proceso de sincronización.
 */
export async function startSync(name, batchId = null) {
    return Sincronizacion.create({
        name,
        startedAt: new Date(),
        status: 'running',
        atlasBatchId: batchId,
        createdAt: new Date()
    });
}

/**
 * Finaliza un proceso de sincronización marcando su estado.
 */
export async function finalizeSync(syncId, status, stats = null, error = null) {
    return Sincronizacion.findByIdAndUpdate(syncId, {
        finishedAt: new Date(),
        status: status,
        stats: stats,
        error: error,
    }, { new: true });
}
