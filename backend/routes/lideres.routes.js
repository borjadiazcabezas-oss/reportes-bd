// backend/routes/lideres.routes.js

import { Router } from 'express';
import { guardarReporteLider } from '../controllers/lideres.controller.js'; 

const router = Router();

router.post('/reporte-raw', guardarReporteLider); // POST /api/lideres/reporte-raw

export default router;
