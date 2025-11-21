// backend/routes/incidencias.routes.js

import { Router } from 'express';
import { registrarIncidencia } from '../controllers/incidencias.controller.js';

const router = Router();

router.post('/registro', registrarIncidencia); // POST /api/incidencias/registro

export default router;
