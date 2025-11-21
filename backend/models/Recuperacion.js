import mongoose from "mongoose";

const recuperacionSchema = new mongoose.Schema({
  produccionId: { type: mongoose.Schema.Types.Mixed, required: true },
  tipo: { type: String, required: true },
  cantidad: { type: Number, required: true },
  notas: { type: String, default: null },
  fecha: { type: Date, required: true },
  createdAt: { type: Date, required: true }
});

export default mongoose.model("Recuperacion", recuperacionSchema);
