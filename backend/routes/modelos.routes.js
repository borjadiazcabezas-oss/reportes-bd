// backend/routes/modelos.routes.js

import { Router } from 'express';
import { getModelosActivos } from '../controllers/modelos.controller.js';

const router = Router();

router.get('/activos', getModelosActivos); // GET /api/modelos/activos

export default router;
