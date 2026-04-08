import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/database/prisma.service';

/**
 * E2E Test Suite para Restaurants API
 * 
 * Este archivo contiene pruebas end-to-end para los endpoints principales:
 * - GET /v1/restaurants (listar)
 * - GET /v1/restaurants/:id (obtener uno)
 * - POST /v1/restaurants (crear)
 * - PUT /v1/restaurants/:id (actualizar)
 * - DELETE /v1/restaurants/:id (eliminar)
 */
describe('Restaurants API (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let adminToken: string;
  let userId: string;
  let adminUserId: string;
  let restaurantId: string;

  /**
   * BOOTSTRAP: Inicializar módulo de testing y aplicación
   */
  beforeAll(async () => {
    // Crear módulo de testing
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Instanciar aplicación
    app = moduleFixture.createNestApplication();
    
    // Aplicar pipes globales
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Inicializar la aplicación
    await app.init();

    // Obtener servicio de Prisma para cleanup
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // Setup: Crear usuarios de prueba
    await setupTestUsers();
  });

  /**
   * CLEANUP: Limpiar base de datos después de todas las pruebas
   */
  afterAll(async () => {
    // Limpiar datos de prueba
    await cleanupTestData();
    
    // Cerrar conexión
    await app.close();
  });

  /**
   * Funciones de Setup
   */
  async function setupTestUsers() {
    // Crear usuario cliente
    const customerRes = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        email: 'customer.test@example.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'Customer',
        phone: '+51912345678',
      })
      .expect(201);

    userId = customerRes.body.data.user.id;

    // Login cliente
    const customerLoginRes = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'customer.test@example.com',
        password: 'TestPassword123!',
      })
      .expect(200);

    authToken = customerLoginRes.body.data.accessToken;

    // Crear usuario admin
    const adminRes = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        email: 'admin.test@example.com',
        password: 'AdminPassword123!',
        firstName: 'Test',
        lastName: 'Admin',
        phone: '+51987654321',
        role: 'ADMIN',
      })
      .expect(201);

    adminUserId = adminRes.body.data.user.id;

    // Login admin
    const adminLoginRes = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'admin.test@example.com',
        password: 'AdminPassword123!',
      })
      .expect(200);

    adminToken = adminLoginRes.body.data.accessToken;
  }

  /**
   * Funciones de Cleanup
   */
  async function cleanupTestData() {
    // Limpiar restaurantes
    await prismaService.restaurant.deleteMany({
      where: {
        ownerId: { in: [adminUserId, userId] },
      },
    });

    // Limpiar usuarios
    await prismaService.user.deleteMany({
      where: {
        email: { in: ['customer.test@example.com', 'admin.test@example.com'] },
      },
    });
  }

  // ============================================================================
  // GET - Listar Restaurantes
  // ============================================================================
  describe('GET /v1/restaurants - Listar restaurantes', () => {
    it('debe retornar lista vacía inicialmente', () => {
      return request(app.getHttpServer())
        .get('/v1/restaurants')
        .expect(200)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.message).toBe('Restaurants retrieved successfully');
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.pagination).toBeDefined();
          expect(res.body.pagination.total).toBeGreaterThanOrEqual(0);
        });
    });

    it('debe aplicar paginación correctamente', () => {
      return request(app.getHttpServer())
        .get('/v1/restaurants')
        .query({ limit: 5, offset: 0 })
        .expect(200)
        .expect((res) => {
          expect(res.body.pagination.limit).toBe(5);
          expect(res.body.pagination.offset).toBe(0);
          expect(res.body.data.length).toBeLessThanOrEqual(5);
        });
    });

    it('debe filtrar por búsqueda (search)', async () => {
      // Crear restaurante de prueba
      const createRes = await request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Pizzeria Test Search',
          email: 'pizzeria@test.com',
          phone: '+51912345678',
          description: 'Test for search',
        })
        .expect(201);

      restaurantId = createRes.body.data.id;

      // Buscar por nombre
      return request(app.getHttpServer())
        .get('/v1/restaurants')
        .query({ search: 'Pizzeria' })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body.data.some((r) => r.name.includes('Pizzeria'))).toBe(
            true,
          );
        });
    });

    it('debe ordenar restaurantes correctamente', () => {
      return request(app.getHttpServer())
        .get('/v1/restaurants')
        .query({ sortBy: 'name', sortOrder: 'asc' })
        .expect(200)
        .expect((res) => {
          const restaurants = res.body.data;
          if (restaurants.length > 1) {
            for (let i = 0; i < restaurants.length - 1; i++) {
              expect(restaurants[i].name).toBeLessThanOrEqual(
                restaurants[i + 1].name,
              );
            }
          }
        });
    });

    it('debe rechazar parámetros inválidos', () => {
      return request(app.getHttpServer())
        .get('/v1/restaurants')
        .query({ limit: 'invalid', offset: -1 })
        .expect(400);
    });
  });

  // ============================================================================
  // GET - Obtener Restaurante por ID
  // ============================================================================
  describe('GET /v1/restaurants/:id - Obtener restaurante', () => {
    let testRestaurantId: string;

    beforeAll(async () => {
      // Crear restaurante para estas pruebas
      const res = await request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Get Test Restaurant',
          email: 'gettest@example.com',
          phone: '+51912345678',
          description: 'Test restaurant for GET endpoint',
        })
        .expect(201);

      testRestaurantId = res.body.data.id;
    });

    it('debe retornar restaurante con todos los campos', () => {
      return request(app.getHttpServer())
        .get(`/v1/restaurants/${testRestaurantId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data.id).toBe(testRestaurantId);
          expect(res.body.data).toHaveProperty('name');
          expect(res.body.data).toHaveProperty('email');
          expect(res.body.data).toHaveProperty('phone');
          expect(res.body.data).toHaveProperty('createdAt');
          expect(res.body.data).toHaveProperty('updatedAt');
        });
    });

    it('debe retornar 404 para ID no existente', () => {
      return request(app.getHttpServer())
        .get('/v1/restaurants/invalid-id-12345')
        .expect(404)
        .expect((res) => {
          expect(res.body.statusCode).toBe(404);
          expect(res.body.error).toBe('RESTAURANT_NOT_FOUND');
          expect(res.body.message).toContain('not found');
        });
    });

    it('debe incluir ubicaciones asociadas', () => {
      return request(app.getHttpServer())
        .get(`/v1/restaurants/${testRestaurantId}?include=locations`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('locations');
          expect(Array.isArray(res.body.data.locations)).toBe(true);
        });
    });

    it('debe incluir categorías asociadas', () => {
      return request(app.getHttpServer())
        .get(`/v1/restaurants/${testRestaurantId}?include=categories`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('categories');
          expect(Array.isArray(res.body.data.categories)).toBe(true);
        });
    });
  });

  // ============================================================================
  // POST - Crear Restaurante
  // ============================================================================
  describe('POST /v1/restaurants - Crear restaurante', () => {
    it('debe crear restaurante con datos válidos', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Post Test Restaurant',
          email: 'posttest@example.com',
          phone: '+51912345678',
          description: 'Test restaurant for POST endpoint',
          cuisineType: 'Italian',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.statusCode).toBe(201);
          expect(res.body.message).toBe('Restaurant created successfully');
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.name).toBe('Post Test Restaurant');
          expect(res.body.data.email).toBe('posttest@example.com');
        });
    });

    it('debe retornar 400 si falta campo requerido (name)', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'noname@example.com',
          phone: '+51912345678',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain('name');
        });
    });

    it('debe retornar 400 si falta campo requerido (email)', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'No Email Restaurant',
          phone: '+51912345678',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain('email');
        });
    });

    it('debe retornar 400 con email inválido', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Invalid Email Restaurant',
          email: 'invalid-email',
          phone: '+51912345678',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain('email');
        });
    });

    it('debe retornar 409 si el nombre ya existe', async () => {
      const name = 'Duplicate Name Test';

      // Crear primer restaurante
      await request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name,
          email: 'first@example.com',
          phone: '+51912345678',
        })
        .expect(201);

      // Intentar crear otro con el mismo nombre
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name,
          email: 'second@example.com',
          phone: '+51987654321',
        })
        .expect(409)
        .expect((res) => {
          expect(res.body.statusCode).toBe(409);
          expect(res.body.error).toBe('DUPLICATE_RESTAURANT_NAME');
        });
    });

    it('debe retornar 401 sin autenticación', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .send({
          name: 'No Auth Restaurant',
          email: 'noauth@example.com',
          phone: '+51912345678',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.statusCode).toBe(401);
          expect(res.body.error).toContain('Unauthorized');
        });
    });

    it('debe retornar 403 si usuario no es admin', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${authToken}`) // Token cliente normal
        .send({
          name: 'No Permission Restaurant',
          email: 'noperm@example.com',
          phone: '+51912345678',
        })
        .expect(403)
        .expect((res) => {
          expect(res.body.statusCode).toBe(403);
          expect(res.body.error).toContain('Forbidden');
        });
    });

    it('debe sanitizar datos de entrada', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Sanitized Restaurant',
          email: 'sanitized@example.com',
          phone: '+51912345678',
          extraField: 'should be removed',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).not.toHaveProperty('extraField');
        });
    });
  });

  // ============================================================================
  // PUT - Actualizar Restaurante
  // ============================================================================
  describe('PUT /v1/restaurants/:id - Actualizar restaurante', () => {
    let updateRestaurantId: string;

    beforeAll(async () => {
      // Crear restaurante para actualizar
      const res = await request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Update Test Restaurant',
          email: 'updatetest@example.com',
          phone: '+51912345678',
          description: 'Original description',
        })
        .expect(201);

      updateRestaurantId = res.body.data.id;
    });

    it('debe actualizar campos permitidos', () => {
      return request(app.getHttpServer())
        .put(`/v1/restaurants/${updateRestaurantId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          description: 'Updated description',
          phone: '+51987654321',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data.description).toBe('Updated description');
          expect(res.body.data.phone).toBe('+51987654321');
        });
    });

    it('debe retornar 404 para ID no existente', () => {
      return request(app.getHttpServer())
        .put('/v1/restaurants/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          description: 'Updated',
        })
        .expect(404);
    });

    it('debe retornar 400 con datos inválidos', () => {
      return request(app.getHttpServer())
        .put(`/v1/restaurants/${updateRestaurantId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'invalid-email',
        })
        .expect(400);
    });

    it('debe retornar 401 sin autenticación', () => {
      return request(app.getHttpServer())
        .put(`/v1/restaurants/${updateRestaurantId}`)
        .send({
          description: 'Updated',
        })
        .expect(401);
    });

    it('debe retornar 403 si no es propietario', async () => {
      // Crear restaurante con otro admin
      const otherAdminRes = await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          email: 'otheradmin@example.com',
          password: 'Password123!',
          firstName: 'Other',
          lastName: 'Admin',
          role: 'ADMIN',
        })
        .expect(201);

      const otherAdminLoginRes = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'otheradmin@example.com',
          password: 'Password123!',
        })
        .expect(200);

      const otherAdminToken = otherAdminLoginRes.body.data.accessToken;

      // Intentar actualizar restaurante del primer admin
      return request(app.getHttpServer())
        .put(`/v1/restaurants/${updateRestaurantId}`)
        .set('Authorization', `Bearer ${otherAdminToken}`)
        .send({
          description: 'Trying to update',
        })
        .expect(403);
    });

    it('debe preservar campos no actualizados', () => {
      return request(app.getHttpServer())
        .put(`/v1/restaurants/${updateRestaurantId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          description: 'Only updating description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.name).toBeDefined();
          expect(res.body.data.email).toBeDefined();
        });
    });

    it('debe rechazar actualización de nombre duplicado', async () => {
      // Crear otro restaurante
      const otherRes = await request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Another Restaurant',
          email: 'another@example.com',
          phone: '+51912345678',
        })
        .expect(201);

      const otherId = otherRes.body.data.id;

      // Intentar renombrar a un nombre que ya existe
      return request(app.getHttpServer())
        .put(`/v1/restaurants/${otherId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Update Test Restaurant',
        })
        .expect(409);
    });
  });

  // ============================================================================
  // DELETE - Eliminar Restaurante
  // ============================================================================
  describe('DELETE /v1/restaurants/:id - Eliminar restaurante', () => {
    let deleteRestaurantId: string;

    beforeAll(async () => {
      // Crear restaurante para eliminar
      const res = await request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Delete Test Restaurant',
          email: 'deletetest@example.com',
          phone: '+51912345678',
        })
        .expect(201);

      deleteRestaurantId = res.body.data.id;
    });

    it('debe eliminar (soft delete) un restaurante', () => {
      return request(app.getHttpServer())
        .delete(`/v1/restaurants/${deleteRestaurantId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.message).toContain('deleted');
        });
    });

    it('debe retornar 404 después de eliminar', () => {
      return request(app.getHttpServer())
        .get(`/v1/restaurants/${deleteRestaurantId}`)
        .expect(404);
    });

    it('debe retornar 404 para ID no existente', () => {
      return request(app.getHttpServer())
        .delete('/v1/restaurants/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('debe retornar 401 sin autenticación', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Delete No Auth Test',
          email: 'deletenoauth@example.com',
          phone: '+51912345678',
        })
        .expect(201);

      return request(app.getHttpServer())
        .delete(`/v1/restaurants/${res.body.data.id}`)
        .expect(401);
    });

    it('debe retornar 403 si no es propietario', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Delete Permission Test',
          email: 'deleteperm@example.com',
          phone: '+51912345678',
        })
        .expect(201);

      const otherAdminToken = (
        await request(app.getHttpServer())
          .post('/v1/auth/login')
          .send({
            email: 'otheradmin@example.com',
            password: 'Password123!',
          })
          .expect(200)
      ).body.data.accessToken;

      return request(app.getHttpServer())
        .delete(`/v1/restaurants/${res.body.data.id}`)
        .set('Authorization', `Bearer ${otherAdminToken}`)
        .expect(403);
    });
  });

  // ============================================================================
  // VALIDACIÓN DE ERRORES GLOBALES
  // ============================================================================
  describe('Global Error Handling', () => {
    it('debe retornar 404 para ruta no existente', () => {
      return request(app.getHttpServer())
        .get('/v1/nonexistent-route')
        .expect(404);
    });

    it('debe retornar 405 para método no permitido', () => {
      return request(app.getHttpServer())
        .patch('/v1/restaurants')
        .expect(405);
    });

    it('debe retornar 400 para JSON inválido', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });

    it('debe manejar errores de validación de string', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 123, // Debe ser string
          email: 'test@example.com',
          phone: '+51912345678',
        })
        .expect(400);
    });

    it('debe rechazar token expirado', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjAsInN1YiI6InRlc3QifQ.test';

      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({
          name: 'Test',
          email: 'test@example.com',
          phone: '+51912345678',
        })
        .expect(401);
    });

    it('debe rechazar token malformado', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'Test',
          email: 'test@example.com',
          phone: '+51912345678',
        })
        .expect(401);
    });

    it('debe retornar estructura de error consistente', () => {
      return request(app.getHttpServer())
        .get('/v1/restaurants/invalid-id')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body).toHaveProperty('error');
          expect(res.body).toHaveProperty('message');
        });
    });
  });

  // ============================================================================
  // PRUEBAS DE RESERVAS (Integración multidominio)
  // ============================================================================
  describe('Reservations Integration', () => {
    let locationId: string;
    let tableId: string;
    let reservationRestaurantId: string;

    beforeAll(async () => {
      // Crear restaurante
      const restRes = await request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Reservation Test Restaurant',
          email: 'reservationtest@example.com',
          phone: '+51912345678',
        })
        .expect(201);

      reservationRestaurantId = restRes.body.data.id;

      // Crear ubicación
      const locRes = await request(app.getHttpServer())
        .post(`/v1/restaurants/${reservationRestaurantId}/locations`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          address: 'Test Address 123',
          city: 'Lima',
          state: 'Lima',
          postalCode: '15001',
          country: 'Peru',
          openingTime: '11:00',
          closingTime: '23:00',
        })
        .expect(201);

      locationId = locRes.body.data.id;

      // Crear tabla
      const tableRes = await request(app.getHttpServer())
        .post(`/v1/locations/${locationId}/tables`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          number: '1',
          capacity: 4,
        })
        .expect(201);

      tableId = tableRes.body.data.id;
    });

    it('debe crear reserva correctamente', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      return request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tableId,
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '19:30',
          guestCount: 4,
          specialRequests: 'Near the window',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.status).toBe('CONFIRMED');
          expect(res.body.data.guestCount).toBe(4);
        });
    });

    it('debe rechazar reserva con capacidad excedida', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      return request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tableId,
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '20:00',
          guestCount: 10, // Excede capacidad de 4
          specialRequests: '',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('INVALID_GUEST_COUNT');
        });
    });
  });
});
