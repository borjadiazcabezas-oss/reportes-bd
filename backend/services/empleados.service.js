// backend/services/empleados.service.js

import Empleado from "../models/Empleado.js";
import Usuario from "../models/Usuario.js";

/**
 * Busca al líder de un operario usando el campo reportsTo.
 */
export async function getLeaderOfUser(userId) {
  const empleado = await Empleado.findOne({ userId });
  if (!empleado || !empleado.reportsTo) return null;

  return Empleado.findOne({ userId: empleado.reportsTo });
}

/**
 * Obtiene todos los empleados que reportan a un líder específico.
 */
export async function getOperariosDelLider(liderUserId) {
  return Empleado.find({ reportsTo: liderUserId });
}

/**
 * Obtiene la lista completa de líderes (o cualquier rol).
 */
export async function getEmpleadosPorRol(rol) {
    return Empleado.find({ rol: rol });
}

/**
 * Valida las credenciales de un usuario. (Implementar hash real aquí)
 */
export async function validarCredenciales(username, password) {
    const user = await Usuario.findOne({ username });
    if (!user) return { valid: false, message: "Usuario no encontrado." };

    const empleado = await Empleado.findOne({ userId: user.userId });
    if (!empleado) return { valid: false, message: "Perfil de empleado no encontrado." };

    // Lógica DUMMY: Reemplazar con bcrypt.compare(password, user.passwordHash)
    const passwordValid = true; 

    if (!passwordValid) return { valid: false, message: "Contraseña incorrecta." };

    return {
        valid: true,
        user: {
            userId: user.userId,
            username: user.username,
            nombre: empleado.nombre,
            rol: empleado.rol,
            reportsTo: empleado.reportsTo,
            roles: user.roles,
        }
    };
}
