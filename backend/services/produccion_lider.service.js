// backend/services/produccion_lider.service.js

import ReporteLider from "../models/ReporteLider.js";
import ProduccionLider from "../models/ProduccionLider.js";
import { calcularTurno } from "./turno.service.js";

/**
 * Procesa un reporte RAW y lo convierte en un documento estructurado de ProduccionLider.
 */
export async function procesarReporteLider(rawReporteId) {
    const reporteRaw = await ReporteLider.findById(rawReporteId);
    if (!reporteRaw) throw new Error("Reporte RAW no encontrado.");

    const { liderUserId, receivedAt, raw } = reporteRaw;
    const turno = calcularTurno(receivedAt);
    
    // **NOTA IMPORTANTE: AQUÍ DEBES AÑADIR LA LÓGICA DE PARSEO ESPECÍFICA DE TU FORMULARIO HTML**

    const produccionDoc = await ProduccionLider.create({
        liderUserId,
        fecha: receivedAt,
        turno,
        lineas: raw.produccion_lineas, // EJEMPLO
        reparacion: raw.reparacion ?? null,
        mermasResumen: raw.mermas ?? null,
        recuperaciones: raw.recuperaciones ?? null,
        incidencias: raw.incidencias ?? null,
        source: 'Formulario Web',
        synced: false,
        createdAt: new Date(),
    });

    await ReporteLider.findByIdAndUpdate(rawReporteId, { 
        processed: true, 
        processedAt: new Date() 
    });

    return produccionDoc;
}
