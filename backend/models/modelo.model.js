// backend/models/modelo.model.js
import mongoose from 'mongoose';

const modeloSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Nombre del modelo (CHEP, IPP, PR80, etc.)
    type: { type: String, required: true, enum: ['Palet', 'Tapa', 'Especial'], default: 'Palet' },
    activo: { type: Boolean, default: true }
}, {
    timestamps: true 
});

const Modelo = mongoose.model('Modelo', modeloSchema);

export default Modelo;