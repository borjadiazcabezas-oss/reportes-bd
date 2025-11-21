// backend/models/empleado.model.js
import mongoose from "mongoose";

const empleadoSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  rol: {
    type: String,
    enum: ["DIRECTOR","GERENTE","LIDER","OPERARIO","ADMIN","MECANICO","SUPERVISOR"],
    required: true
  },
  reportsTo: { type: String, default: null },
  leaderOf: [{ type: String }],
  telefono: { type: String, default: null },
  linea: { type: String, default: null },
  activo: { type: Boolean, default: true },
  meta: { type: Object, default: null },
  // Usamos timestamps de Mongoose para createdAt y updatedAt
}, {
    timestamps: true 
});

export default mongoose.model("Empleado", empleadoSchema);