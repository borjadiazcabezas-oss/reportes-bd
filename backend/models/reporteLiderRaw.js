// backend/models/reporteLiderRaw.model.js
import mongoose from "mongoose";

const reporteLiderRawSchema = new mongoose.Schema({
  liderUserId: { type: String, required: true },
  receivedAt: { type: Date, required: true },
  raw: { type: Object, required: true },
  processed: { type: Boolean, default: false },
  processedAt: { type: Date, default: null },
  // Usamos timestamps de Mongoose para createdAt y updatedAt
}, {
    timestamps: true 
});

export default mongoose.model("ReporteLiderRaw", reporteLiderRawSchema);