// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ---------------- ES MODULES: __dirname ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------- EXPRESS ----------------
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ---------------- RUTAS MODULARES ----------------
import authRoutes from './routes/auth.routes.js';
import empleadosRoutes from './routes/empleados.routes.js';
import actividadesRoutes from './routes/actividades.routes.js';
import lideresRoutes from './routes/lideres.routes.js';
import modelosRoutes from './routes/modelos.routes.js';
import incidenciasRoutes from './routes/incidencias.routes.js';
import mermasRoutes from './routes/mermas.routes.js';
import recuperacionesRoutes from './routes/recuperaciones.routes.js';
import resumenRoutes from './routes/resumen.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/lideres', lideresRoutes);
app.use('/api/modelos', modelosRoutes);
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/mermas', mermasRoutes);
app.use('/api/recuperaciones', recuperacionesRoutes);
app.use('/api/resumen', resumenRoutes);

// ---------------- MONGODB ----------------
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ No se encontró la variable de entorno MONGO_URI');
} else {
  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error MongoDB:', err));
}

// ---------------- EXPORTAR APP PARA VERCEL ----------------
export default app;
