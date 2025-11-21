import mongoose from "mongoose";

const sincronizacionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startedAt: { type: Date, required: true },
  finishedAt: { type: Date, default: null },
  status: { type: String, enum: ["running","ok","failed"], required: true },
  stats: { type: Object, default: null },
  error: { type: String, default: null },
  atlasBatchId: { type: String, default: null },
  localBatchId: { type: String, default: null },
  createdAt: { type: Date, required: true }
});

export default mongoose.model("Sincronizacion", sincronizacionSchema);
