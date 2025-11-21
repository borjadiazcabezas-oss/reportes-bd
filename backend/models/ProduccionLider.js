import mongoose from "mongoose";

const produccionLiderSchema = new mongoose.Schema({
  liderUserId: { type: String, required: true },
  fecha: { type: Date, required: true },
  turno: { type: Number, required: true },
  lineas: [{
    modeloId: String,
    palets: Number,
    tapas: Number,
    observaciones: String
  }],
  reparacion: { type: Array, default: null },
  mermasResumen: { type: Object, default: null },
  recuperaciones: { type: Array, default: null },
  incidencias: { type: Object, default: null },
  source: { type: String, default: null },
  synced: { type: Boolean, default: null },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, default: null }
});

export default mongoose.model("ProduccionLider", produccionLiderSchema);
