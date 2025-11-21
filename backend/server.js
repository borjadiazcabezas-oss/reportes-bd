// backend/server.js  (sustituir o integrar)
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import authRoutes from './routes/auth.routes.js';
import empleadosRoutes from './routes/empleados.routes.js';
import actividadesRoutes from './routes/actividades.routes.js';
import lideresRoutes from './routes/lideres.routes.js';
import modelosRoutes from './routes/modelos.routes.js';
import incidenciasRoutes from './routes/incidencias.routes.js';
import mermasRoutes from './routes/mermas.routes.js';
import recuperacionesRoutes from './routes/recuperaciones.routes.js';
import resumenRoutes from './routes/resumen.routes.js';
import adminRoutes from './routes/admin.routes.js'; // nuevo

import corsConfig from './middleware/corsConfig.js'; // generado por el script
import { requireAuth, requireRole } from './middleware/auth.js'; // generado por el script

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// CORS: usar configuración que valida origin
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

// MongoDB (usar variable de entorno)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/produccion';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/lideres', lideresRoutes);
app.use('/api/modelos', modelosRoutes);
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/mermas', mermasRoutes);
app.use('/api/recuperaciones', recuperacionesRoutes);
app.use('/api/resumen', resumenRoutes);

// Rutas administrativas protegidas
app.use('/api/admin', requireAuth, requireRole('ADMIN'), adminRoutes);

// START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
