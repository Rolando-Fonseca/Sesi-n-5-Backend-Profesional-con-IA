# E2E Testing Guide - Restaurants Backend

Guía completa para ejecutar y escribir pruebas end-to-end con Jest y Supertest en NestJS.

## 📋 Tabla de Contenidos

1. [Instalación](#instalación)
2. [Estructura de Pruebas](#estructura-de-pruebas)
3. [Ejecutar Pruebas](#ejecutar-pruebas)
4. [Patrones y Mejores Prácticas](#patrones-y-mejores-prácticas)
5. [Casos de Prueba Cubiertos](#casos-de-prueba-cubiertos)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Instalación

### 1. Instalar dependencias de testing

```bash
npm install --save-dev @nestjs/testing jest @types/jest ts-jest supertest @types/supertest
```

### 2. Verificar package.json

```json
{
  "devDependencies": {
    "@nestjs/testing": "^10.0.0",
    "@types/jest": "^29.5.0",
    "@types/supertest": "^2.0.12",
    "jest": "^29.5.0",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0"
  }
}
```

### 3. Configurar variables de entorno para testing

Crear archivo `.env.test`:

```
NODE_ENV=test
DATABASE_URL=postgresql://user:password@localhost:5432/restaurants_test
JWT_SECRET=test-secret-key
JWT_EXPIRES_IN=3600
API_PORT=3001
```

---

## 📁 Estructura de Pruebas

```
project-root/
├── test/
│   ├── restaurants.e2e-spec.ts      # Pruebas para Restaurants API
│   ├── reservations.e2e-spec.ts     # Pruebas para Reservations API
│   ├── setup.ts                     # Setup global de pruebas
│   └── jest-e2e.json               # Config de Jest para E2E
├── jest-e2e.config.js              # Configuración Jest
├── tsconfig.spec.json              # TypeScript para tests
└── src/
    ├── app.module.ts
    └── ...
```

### Anatomía de un test E2E

```typescript
describe('Restaurants API (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  // ============================================================================
  // BOOTSTRAP - Inicializar la aplicación
  // ============================================================================
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  // ============================================================================
  // CLEANUP - Limpiar después de tests
  // ============================================================================
  afterAll(async () => {
    await cleanupData();
    await app.close();
  });

  // ============================================================================
  // CASOS DE PRUEBA - GET
  // ============================================================================
  describe('GET /v1/restaurants', () => {
    it('debe retornar lista de restaurantes', () => {
      return request(app.getHttpServer())
        .get('/v1/restaurants')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeInstanceOf(Array);
        });
    });
  });

  // ============================================================================
  // CASOS DE PRUEBA - POST
  // ============================================================================
  describe('POST /v1/restaurants', () => {
    it('debe crear un restaurante', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'New Restaurant',
          email: 'test@example.com',
          phone: '+51912345678',
        })
        .expect(201);
    });
  });
});
```

---

## ▶️ Ejecutar Pruebas

### 1. Ejecutar todas las pruebas E2E

```bash
npm run test:e2e
```

### 2. Ejecutar suite específica

```bash
npm run test:e2e -- restaurants.e2e-spec.ts
npm run test:e2e -- reservations.e2e-spec.ts
```

### 3. Ejecutar describe específico

```bash
npm run test:e2e -- --testNamePattern="Restaurants API"
npm run test:e2e -- -t "debe crear un restaurante"
```

### 4. Ejecutar con cobertura

```bash
npm run test:e2e -- --coverage
```

### 5. Ejecutar en modo watch (desarrollo)

```bash
npm run test:e2e -- --watch
```

### 6. Ejecutar con output detallado

```bash
npm run test:e2e -- --verbose
```

### 7. Ejecutar en paralelo

```bash
npm run test:e2e -- --maxWorkers=4
```

### 8. Ejecutar una sola prueba

```bash
npm run test:e2e -- -t "debe retornar lista de restaurantes"
```

---

## 📚 Patrones y Mejores Prácticas

### 1. Setup y Cleanup

```typescript
beforeAll(async () => {
  // Setup: Crear datos de prueba
  await setupTestUsers();
  await setupTestRestaurants();
});

afterAll(async () => {
  // Cleanup: Eliminar datos de prueba
  await cleanupTestData();
});

afterEach(async () => {
  // Limpiar entre pruebas (opcional)
});
```

### 2. Pruebas de autenticación

```typescript
// No autenticado
request(app.getHttpServer())
  .get('/v1/restaurants')
  .expect(401);

// Autenticado
request(app.getHttpServer())
  .get('/v1/restaurants')
  .set('Authorization', `Bearer ${authToken}`)
  .expect(200);

// Token inválido
request(app.getHttpServer())
  .get('/v1/restaurants')
  .set('Authorization', 'Bearer invalid-token')
  .expect(401);
```

### 3. Validación de respuestas

```typescript
.expect(200)
.expect((res) => {
  // Validar estructura
  expect(res.body).toHaveProperty('statusCode');
  expect(res.body).toHaveProperty('data');
  expect(res.body).toHaveProperty('message');

  // Validar tipos
  expect(res.body.data).toBeInstanceOf(Array);
  expect(res.body.statusCode).toBe(200);

  // Validar contenido
  expect(res.body.data.length).toBeGreaterThan(0);
  expect(res.body.data[0]).toHaveProperty('id');
  expect(res.body.data[0]).toHaveProperty('name');
});
```

### 4. Variables almacenadas

```typescript
let restaurantId: string;

// Guardar ID del response
.expect(201)
.expect((res) => {
  restaurantId = res.body.data.id;
});

// Reutilizar en siguiente test
.get(`/v1/restaurants/${restaurantId}`)
.expect(200);
```

### 5. Pruebas de errores

```typescript
// Error de validación
.expect(400)
.expect((res) => {
  expect(res.body.statusCode).toBe(400);
  expect(res.body.error).toBe('VALIDATION_ERROR');
  expect(res.body.message).toContain('email');
});

// Recurso no encontrado
.expect(404)
.expect((res) => {
  expect(res.body.error).toBe('RESTAURANT_NOT_FOUND');
});

// Conflict
.expect(409)
.expect((res) => {
  expect(res.body.error).toBe('DUPLICATE_RESTAURANT_NAME');
});
```

### 6. Pruebas con transacciones

```typescript
await prismaService.$transaction(async (tx) => {
  // Realizar operaciones atómicas
  await tx.user.create({ data: userData });
  await tx.restaurant.create({ data: restaurantData });
});
```

---

## ✅ Casos de Prueba Cubiertos

### Restaurants API

#### GET /v1/restaurants
- ✓ Listar restaurantes con paginación
- ✓ Filtrar por búsqueda
- ✓ Ordenar resultados
- ✓ Rechazar parámetros inválidos

#### GET /v1/restaurants/:id
- ✓ Obtener detalles del restaurante
- ✓ Retornar 404 para ID no existente
- ✓ Incluir relaciones (locations, categories)

#### POST /v1/restaurants
- ✓ Crear con datos válidos
- ✓ Validar campos requeridos
- ✓ Validar formato de email
- ✓ Rechazar duplicados
- ✓ Validar autenticación
- ✓ Validar autorización (admin)
- ✓ Sanitizar datos de entrada

#### PUT /v1/restaurants/:id
- ✓ Actualizar campos permitidos
- ✓ Preservar campos no actualizados
- ✓ Validar autorización (propietario)
- ✓ Rechazar datos inválidos
- ✓ Retornar 404 para ID no existente

#### DELETE /v1/restaurants/:id
- ✓ Soft delete correctamente
- ✓ Retornar 404 después de eliminar
- ✓ Validar autorización

### Reservations API

#### POST /v1/reservations
- ✓ Crear con datos válidos
- ✓ Validar campos requeridos
- ✓ Rechazar fechas pasadas
- ✓ Validar capacidad de mesa
- ✓ Rechazar mesas no disponibles
- ✓ Validar autenticación

#### GET /v1/reservations
- ✓ Listar especializadas del usuario
- ✓ Filtrar por estado
- ✓ Aplicar paginación
- ✓ Ordenar por fecha
- ✓ Aislar por usuario

#### GET /v1/reservations/:id
- ✓ Obtener detalles completos
- ✓ Validar autorización (propietario)
- ✓ Retornar 404 para ID no existente

#### PUT /v1/reservations/:id
- ✓ Actualizar fecha y hora
- ✓ Actualizar número de comensales
- ✓ Validar capacidad de mesa
- ✓ Verificar disponibilidad
- ✓ Rechazar fechas pasadas

#### DELETE /v1/reservations/:id
- ✓ Cancelar reserva
- ✓ Marcar mesa como AVAILABLE
- ✓ Rechazar si ya está cancelada
- ✓ Validar autorización

### Error Handling Global
- ✓ 404 para rutas no existentes
- ✓ 405 para métodos no permitidos
- ✓ 400 para JSON inválido
- ✓ Validación de tipos
- ✓ Token expirado
- ✓ Token malformado
- ✓ Estructura de error consistente

---

## 📊 Cobertura de Pruebas

Para verificar cobertura:

```bash
npm run test:e2e -- --coverage
```

Archivos generados en `coverage/`:
- `coverage/lcov.html` - Reporte visual en navegador
- `coverage/coverage-summary.json` - Resumen en JSON

Objetivo de cobertura:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

---

## 🐛 Troubleshooting

### Error: "connect ECONNREFUSED"

Problema: La BD de prueba no está ejecutándose

Solución:
```bash
# Asegurarse que PostgreSQL esteja corriendo
docker-compose up -d postgres

# Verificar conexión
npm run prisma:migrate -- --skip-generate
```

### Error: "Jest did not exit one second after the test run has completed"

Problema: Conexiones abiertas que no se cierran

Solución:
```typescript
afterAll(async () => {
  // Asegurarse de cerrar la app
  await app.close();
  
  // Cerrar Prisma
  await prismaService.$disconnect();
});
```

### Error: "port already in use"

Problema: Puerto 3000 ya está en uso

Solución:
```bash
# Cambiar puerto en .env.test
API_PORT=3001

# O matar proceso
lsof -ti:3000 | xargs kill -9
```

### Error: "Test timeout of 5000ms exceeded"

Problema: Timeout muy corto para tests E2E

Solución: Ya está configurado a 60segundos en `jest-e2e.config.js`

```bash
# O aumentar en CLI
npm run test:e2e -- --testTimeout=120000
```

### Error: "FOREIGN KEY constraint failed"

Problema: Orden de creación de datos

Solución: Crear padres antes que hijos

```typescript
// Correcto: primero restaurante, luego ubicación
const restaurant = await createRestaurant();
const location = await createLocation(restaurant.id);
```

### Error: "Cannot connect to AppModule"

Problema: AppModule no está importando DatabaseModule globalmente

Solución:
```typescript
// src/app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,  // PRIMERO
    RestaurantsModule,
  ],
})
export class AppModule {}
```

---

## 📝 Escribir Nuevas Pruebas E2E

### Template básico

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('Features API (E2E)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Login
    const res = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200);

    token = res.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /v1/features', () => {
    it('debe listar features', () => {
      return request(app.getHttpServer())
        .get('/v1/features')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
```

---

## 📦 npm Scripts

Agregar a `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./jest-e2e.config.js",
    "test:e2e:watch": "jest --config ./jest-e2e.config.js --watch",
    "test:e2e:cov": "jest --config ./jest-e2e.config.js --coverage",
    "test:e2e:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --config ./jest-e2e.config.js --runInBand"
  }
}
```

---

## 🎯 Mejores Prácticas

1. **Aislar datos de prueba**: Usar prefijos únicos o IDs generados
2. **Cleanup exhaustivo**: Limpiar todo en `afterAll`
3. **Pruebas independientes**: No depender de orden de ejecución
4. **Mensajes claros**: Describir qué se prueba en `it()`
5. **Validaciones múltiples**: Verificar estructura, estado y datos
6. **Manejo de errores**: Probar casos de éxito y fracaso
7. **Performance**: Usar `maxWorkers` para evitar conflictos de BD
8. **Fixtures**: Crear funciones reutilizables para setup

---

## 🔗 Referencias

- [Jest Documentation](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing)

