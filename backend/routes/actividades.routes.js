// backend/routes/actividades.routes.js

import { Router } from 'express';
import { registrarActividad } from '../controllers/actividades.controller.js';

const router = Router();

router.post('/registro', registrarActividad); // POST /api/actividades/registro

export default router;
