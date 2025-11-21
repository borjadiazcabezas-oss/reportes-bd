// backend/models/actividad.model.js
import mongoose from "mongoose";

const actividadSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Clave de indexación
  operarioNombre: { type: String, default: null },
  activityType: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, default: null },
  durationMs: { type: Number, default: null },
  turno: { type: Number, default: null },
  startComment: { type: String, default: null },
  endComment: { type: String, default: null },
  synced: { type: Boolean, default: false },
  // Usamos timestamps de Mongoose para createdAt y updatedAt
}, {
    timestamps: true 
});

export default mongoose.model("Actividad", actividadSchema);