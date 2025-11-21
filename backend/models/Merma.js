import mongoose from "mongoose";

const mermaSchema = new mongoose.Schema({
  produccionId: { type: mongoose.Schema.Types.Mixed, required: true },
  tipo: { type: String, required: true },
  cantidad: { type: Number, required: true },
  unidad: { type: String, default: null },
  motivo: { type: String, default: null },
  dimensiones: { type: Object, default: null },
  fecha: { type: Date, required: true },
  reportadoPor: { type: String, required: true },
  createdAt: { type: Date, required: true }
});

export default mongoose.model("Merma", mermaSchema);
