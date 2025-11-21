// backend/server.js

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';

// MÓDULOS PARA SOPORTE DE __dirname EN ES MODULES (NECESARIO al usar 'import')
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------- 1. IMPORTACIÓN DE RUTAS MODULARES ----------------
// Estos archivos contienen toda la lógica (controladores, servicios) de la nueva arquitectura.
import authRoutes from './routes/auth.routes.js';
import empleadosRoutes from './routes/empleados.routes.js';
import actividadesRoutes from './routes/actividades.routes.js';
import lideresRoutes from './routes/lideres.routes.js';
import modelosRoutes from './routes/modelos.routes.js';
import incidenciasRoutes from './routes/incidencias.routes.js';
import mermasRoutes from './routes/mermas.routes.js';
import recuperacionesRoutes from './routes/recuperaciones.routes.js';
import resumenRoutes from './routes/resumen.routes.js';
// -------------------------------------------------------------------

const app = express();
app.use(cors());
app.use(express.json());
// Servir la carpeta 'public' correctamente
app.use(express.static(path.join(__dirname, '../public')));

// ---------------- 2. CONFIGURACIÓN MONGODB ----------------
// La conexión ahora soporta la sintaxis ES Modules.
const MONGO_URI = 'mongodb://127.0.0.1:27017/produccion'; // Mantén tu URI local
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// ---------------- 3. USO DE RUTAS MODULARES (Endpoints) ----------------
// La lógica antigua de /api/saveActivity y /api/getActivities ha sido reemplazada por estos módulos.
app.use('/api/auth', authRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/lideres', lideresRoutes);
app.use('/api/modelos', modelosRoutes);
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/mermas', mermasRoutes);
app.use('/api/recuperaciones', recuperacionesRoutes);
app.use('/api/resumen', resumenRoutes);
// -----------------------------------------------------------------------

// NOTA: Se eliminaron completamente las definiciones de schemas, modelos (Activity) y
// los endpoints monolíticos (`/api/saveActivity`, `/api/downloadDB`, `/api/clearDB`).
// Si necesitas esos endpoints, deberás re-implementarlos en un módulo `admin.routes.js`.

// ---------------- INICIO DEL SERVIDOR ----------------
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));