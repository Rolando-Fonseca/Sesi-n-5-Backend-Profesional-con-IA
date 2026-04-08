/**
 * Setup file para pruebas E2E
 * Ejecuta antes de todas las pruebas E2E
 */

/**
 * Configuración global de timeout para pruebas
 */
jest.setTimeout(60000);

/**
 * Silenciar logs durante las pruebas (opcional)
 * Comentar para debug
 */
global.console = {
  ...console,
  // Comentar o descomentar según necesidad
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Mantener errors y errors
  error: console.error,
  fatal: console.error,
};

/**
 * Variable global para controlar la salida
 */
process.env.NODE_ENV = "test";

/**
 * Aumentar límite de listeners para evitar memory leak warnings
 */
process.setMaxListeners(0);
