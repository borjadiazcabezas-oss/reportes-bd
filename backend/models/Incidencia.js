import mongoose from "mongoose";

const incidenciaSchema = new mongoose.Schema({
  type: { type: String, required: true },
  reportedBy: { type: String, required: true },
  reportedAt: { type: Date, required: true },
  description: { type: String, default: null },
  severity: { type: String, enum: ["baja","media","alta","critica"], required: true },
  status: { type: String, enum: ["abierta","en_proceso","resuelta","cerrada"], required: true },
  assignedTo: { type: String, default: null },
  actions: { type: Array, default: null },
  closedAt: { type: Date, default: null },
  createdAt: { type: Date, required: true }
});

export default mongoose.model("Incidencia", incidenciaSchema);
