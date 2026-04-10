/**
 * Validation Utilities
 * 
 * Validadores personalizados para DTOs.
 * Extensiones de class-validator para reglas de negocio específicas.
 * 
 * Ver: architecture_nest.md - Sección DTO Validation
 */

/**
 * Valida que un string contiene solo caracteres alphanumericos y espacios
 */
export function isValidRestaurantName(name: string): boolean {
  return /^[a-zA-Z0-9\s\-\.&']+$/.test(name);
}

/**
 * Valida que una URL es válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida que un teléfono tiene formato válido
 */
export function isValidPhoneNumber(phone: string): boolean {
  return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Valida que un horario es válido (HH:MM)
 */
export function isValidTimeFormat(time: string): boolean {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}

/**
 * Calcula si una fecha está en el futuro
 */
export function isFutureDate(date: Date): boolean {
  return date > new Date();
}
