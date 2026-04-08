module.exports = {
  // Ambiente de prueba
  testEnvironment: 'node',

  // Patrón de archivos de prueba E2E
  testRegex: '.e2e-spec.ts$',

  // Raíz de las pruebas
  rootDir: '.',

  // Traducciones de módulos
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // Transformar TypeScript a JavaScript
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // Extensiones de archivo
  moduleFileExtensions: ['js', 'json', 'ts'],

  // Configuración de ts-jest
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      isolatedModules: true,
    },
  },

  // Timeout para pruebas E2E (30 segundos por defecto, aumentamos a 60)
  testTimeout: 60000,

  // Configuración de cobertura (opcional)
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.interface.ts',
    '!src/**/index.ts',
  ],

  // Setup y teardown
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],

  // Verbosidad
  verbose: true,

  // Máximo de workers (limita concurrencia para evitar problemas con BD)
  maxWorkers: '50%',

  // ForceExit después de completar todas las pruebas
  forceExit: true,

  // Detectar archivos abiertos
  detectOpenHandles: true,
};
