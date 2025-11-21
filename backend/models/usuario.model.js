// backend/models/usuario.model.js
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, default: null },
  roles: [{ type: String }],
  lastLogin: { type: Date, default: null },
  locked: { type: Boolean, default: false },
  // Usamos timestamps de Mongoose para createdAt y updatedAt
}, {
    timestamps: true 
});

export default mongoose.model("Usuario", usuarioSchema);