// backend/routes/recuperaciones.routes.js

import { Router } from 'express';
import { registrarRecuperacion } from '../controllers/recuperaciones.controller.js';

const router = Router();

router.post('/registro', registrarRecuperacion); // POST /api/recuperaciones/registro

export default router;
