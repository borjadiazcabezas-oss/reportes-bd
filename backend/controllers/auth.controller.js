// backend/controllers/auth.controller.js
import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ ok:false, message: 'Missing credentials' });

    const user = await Usuario.findOne({ username });
    if (!user) return res.status(401).json({ ok:false, message: 'Usuario o contraseña inválidos' });

    if (!user.passwordHash) return res.status(401).json({ ok:false, message: 'Usuario sin contraseña establecida' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ ok:false, message: 'Usuario o contraseña inválidos' });

    // payload mínimo: userId y roles
    const payload = { userId: user.userId, username: user.username, roles: user.roles || [] };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // actualizar lastLogin
    user.lastLogin = new Date();
    await user.save();

    res.json({ ok:true, data: { token, user: payload } });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ ok:false, error: err.message });
  }
}
