// backend/routes/empleados.routes.js

import { Router } from 'express';
import { getEmpleadosPorRol, getOperariosDelLider } from '../services/empleados.service.js';

const router = Router();

// GET /api/empleados/lideres
router.get('/lideres', async (req, res) => {
    try {
        const lideres = await getEmpleadosPorRol("LIDER");
        res.json({ ok: true, data: lideres });
    } catch(err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// GET /api/empleados/operarios-de-lider?liderId=XYZ
router.get('/operarios-de-lider', async (req, res) => {
    try {
        const { liderId } = req.query;
        if (!liderId) return res.status(400).json({ ok: false, error: "Falta el parámetro liderId." });
        
        const operarios = await getOperariosDelLider(liderId);
        res.json({ ok: true, data: operarios });
    } catch(err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

export default router;
