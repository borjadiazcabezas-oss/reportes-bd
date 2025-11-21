import mongoose from "mongoose";

const resumenTurnoSchema = new mongoose.Schema({
  date: { type: String, required: true },
  turno: { type: Number, required: true },
  liderUserId: { type: String, default: null },
  palets_totales: { type: Number, required: true },
  horas_productivas: { type: Number, default: null },
  horas_no_productivas: { type: Number, default: null },
  productividad_relativa: { type: Number, default: null },
  productividad_real: { type: Number, default: null },
  detalles: { type: Object, default: null },
  generatedAt: { type: Date, required: true }
});

export default mongoose.model("ResumenTurno", resumenTurnoSchema);
