// backend/routes/mermas.routes.js

import { Router } from 'express';
import { registrarMerma } from '../controllers/mermas.controller.js';

const router = Router();

router.post('/registro', registrarMerma); // POST /api/mermas/registro

export default router;
