// backend/services/turno.service.js

/**
 * Calcula el turno basándose en la hora de inicio (06:00, 14:00, 22:00).
 * @param {Date} date - Objeto Date para calcular el turno.
 * @returns {number} 1 (Mañana), 2 (Tarde), o 3 (Noche).
 */
export function calcularTurno(date = new Date()) {
  const h = date.getHours();

  if (h >= 6 && h < 14) return 1;
  if (h >= 14 && h < 22) return 2;
  return 3; 
}
