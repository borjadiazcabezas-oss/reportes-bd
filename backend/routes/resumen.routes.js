// backend/routes/resumen.routes.js

import { Router } from 'express';
import { generarResumen } from '../controllers/resumen.controller.js';

const router = Router();

router.post('/generar', generarResumen); // POST /api/resumen/generar

export default router;
