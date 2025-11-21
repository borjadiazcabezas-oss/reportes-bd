import mongoose from "mongoose";

const auditoriaSchema = new mongoose.Schema({
  actor: { type: String, required: true },
  action: { type: String, required: true },
  at: { type: Date, required: true },
  details: { type: Object, required: true }
});

export default mongoose.model("Auditoria", auditoriaSchema);
