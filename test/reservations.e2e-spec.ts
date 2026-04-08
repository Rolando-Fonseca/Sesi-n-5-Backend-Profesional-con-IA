import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/database/prisma.service';

/**
 * E2E Test Suite para Reservations API
 * 
 * Pruebas para operaciones de reservas:
 * - POST /v1/reservations (crear)
 * - GET /v1/reservations (listar)
 * - GET /v1/reservations/:id (obtener)
 * - PUT /v1/reservations/:id (actualizar)
 * - DELETE /v1/reservations/:id (cancelar)
 */
describe('Reservations API (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let customerToken: string;
  let adminToken: string;
  let customerId: string;
  let adminId: string;
  let restaurantId: string;
  let locationId: string;
  let tableId: string;
  let reservationId: string;

  /**
   * Bootstrap: Setup de la aplicación y datos de prueba
   */
  beforeAll(async () => {
    // Crear módulo de testing
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Instanciar app
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // Setup: Crear usuarios y restaurante
    await setupTestEnvironment();
  });

  /**
   * Cleanup: Limpiar datos después de pruebas
   */
  afterAll(async () => {
    await cleanupTestEnvironment();
    await app.close();
  });

  /**
   * Functions de Setup
   */
  async function setupTestEnvironment() {
    // Crear usuario cliente
    const customerRes = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        email: 'reservation.customer@test.com',
        password: 'TestPassword123!',
        firstName: 'Reservation',
        lastName: 'Customer',
        phone: '+51912345678',
      })
      .expect(201);

    customerId = customerRes.body.data.user.id;

    // Login cliente
    const customerLoginRes = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'reservation.customer@test.com',
        password: 'TestPassword123!',
      })
      .expect(200);

    customerToken = customerLoginRes.body.data.accessToken;

    // Crear usuario admin
    const adminRes = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        email: 'reservation.admin@test.com',
        password: 'AdminPassword123!',
        firstName: 'Reservation',
        lastName: 'Admin',
        phone: '+51987654321',
        role: 'ADMIN',
      })
      .expect(201);

    adminId = adminRes.body.data.user.id;

    // Login admin
    const adminLoginRes = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'reservation.admin@test.com',
        password: 'AdminPassword123!',
      })
      .expect(200);

    adminToken = adminLoginRes.body.data.accessToken;

    // Crear restaurante
    const restaurantRes = await request(app.getHttpServer())
      .post('/v1/restaurants')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Reservation Test Restaurant',
        email: 'reservationtest@example.com',
        phone: '+51912345678',
        description: 'Restaurant for reservation tests',
      })
      .expect(201);

    restaurantId = restaurantRes.body.data.id;

    // Crear ubicación
    const locationRes = await request(app.getHttpServer())
      .post(`/v1/restaurants/${restaurantId}/locations`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        address: 'Test Address 123',
        city: 'Lima',
        state: 'Lima',
        postalCode: '15001',
        country: 'Peru',
        latitude: -12.0931,
        longitude: -77.0197,
        openingTime: '11:00',
        closingTime: '23:00',
      })
      .expect(201);

    locationId = locationRes.body.data.id;

    // Crear tabla
    const tableRes = await request(app.getHttpServer())
      .post(`/v1/locations/${locationId}/tables`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        number: 'A1',
        capacity: 4,
        status: 'AVAILABLE',
      })
      .expect(201);

    tableId = tableRes.body.data.id;
  }

  /**
   * Functions de Cleanup
   */
  async function cleanupTestEnvironment() {
    // Deletear datos de prueba
    await prismaService.reservation.deleteMany({
      where: { OR: [{ userId: customerId }, { userId: adminId }] },
    });

    await prismaService.table.deleteMany({
      where: { location: { id: locationId } },
    });

    await prismaService.location.deleteMany({
      where: { restaurantId },
    });

    await prismaService.restaurant.deleteMany({
      where: { id: restaurantId },
    });

    await prismaService.user.deleteMany({
      where: {
        OR: [
          { id: customerId },
          { id: adminId },
        ],
      },
    });
  }

  // ============================================================================
  // POST - Crear Reserva
  // ============================================================================
  describe('POST /v1/reservations - Crear reserva', () => {
    it('debe crear una reserva con datos válidos', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      return request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tableId,
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '19:30',
          guestCount: 4,
          specialRequests: 'Mesa cerca de la ventana',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.statusCode).toBe(201);
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.status).toBe('CONFIRMED');
          expect(res.body.data.guestCount).toBe(4);
          expect(res.body.data.reservationTime).toBe('19:30');
          
          // Guardar ID para siguientes pruebas
          reservationId = res.body.data.id;
        });
    });

    it('debe rechazar reserva sin autenticación', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      return request(app.getHttpServer())
        .post('/v1/reservations')
        .send({
          tableId,
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '19:30',
          guestCount: 4,
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.statusCode).toBe(401);
          expect(res.body.error).toContain('Unauthorized');
        });
    });

    it('debe retornar 400 si falta tableId', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      return request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '19:30',
          guestCount: 4,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain('tableId');
        });
    });

    it('debe retornar 400 si falta reservationDate', () => {
      return request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tableId,
          reservationTime: '19:30',
          guestCount: 4,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain('reservationDate');
        });
    });

    it('debe retornar 400 si guestCount es inválido', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      return request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tableId,
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '19:30',
          guestCount: -1, // Inválido
        })
        .expect(400);
    });

    it('debe rechazar reserva en fecha pasada', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      return request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tableId,
          reservationDate: pastDate.toISOString().split('T')[0],
          reservationTime: '19:30',
          guestCount: 4,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('INVALID_RESERVATION_DATE');
        });
    });

    it('debe rechazar si guestCount excede capacidad de mesa', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      return request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tableId,
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '20:00',
          guestCount: 10, // Mesa tiene capacidad 4
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('INVALID_GUEST_COUNT');
          expect(res.body.details).toHaveProperty('tableCapacity');
        });
    });

    it('debe rechazar si mesa no está disponible', async () => {
      // Crear otra reserva para ocupar la mesa
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      await request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tableId,
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '19:30',
          guestCount: 4,
        })
        .expect(201);

      // Intentar reservar la misma mesa a la misma hora
      return request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tableId,
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '19:30',
          guestCount: 2,
        })
        .expect(409)
        .expect((res) => {
          expect(res.body.error).toBe('TABLE_NOT_AVAILABLE');
        });
    });

    it('debe rechazar tableId inválido', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      return request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tableId: 'invalid-table-id',
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '19:30',
          guestCount: 4,
        })
        .expect(404)
        .expect((res) => {
          expect(res.body.error).toBe('TABLE_NOT_FOUND');
        });
    });
  });

  // ============================================================================
  // GET - Listar Reservas
  // ============================================================================
  describe('GET /v1/reservations - Listar reservas', () => {
    it('debe retornar lista de reservas del usuario', () => {
      return request(app.getHttpServer())
        .get('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.pagination).toBeDefined();
          
          // Debe incluir la reserva creada
          const hasReservation = res.body.data.some(
            (r) => r.id === reservationId,
          );
          expect(hasReservation).toBe(true);
        });
    });

    it('debe retornar 401 sin autenticación', () => {
      return request(app.getHttpServer())
        .get('/v1/reservations')
        .expect(401);
    });

    it('debe filtrar por estado (status)', () => {
      return request(app.getHttpServer())
        .get('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .query({ status: 'CONFIRMED' })
        .expect(200)
        .expect((res) => {
          res.body.data.forEach((reservation) => {
            expect(reservation.status).toBe('CONFIRMED');
          });
        });
    });

    it('debe aplicar paginación correctamente', () => {
      return request(app.getHttpServer())
        .get('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .query({ limit: 2, offset: 0 })
        .expect(200)
        .expect((res) => {
          expect(res.body.pagination.limit).toBe(2);
          expect(res.body.pagination.offset).toBe(0);
        });
    });

    it('debe ordenar por fecha de reserva', () => {
      return request(app.getHttpServer())
        .get('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .query({ sortBy: 'reservationDate', sortOrder: 'desc' })
        .expect(200)
        .expect((res) => {
          const dates = res.body.data.map((r) => new Date(r.reservationDate));
          for (let i = 0; i < dates.length - 1; i++) {
            expect(dates[i].getTime()).toBeGreaterThanOrEqual(
              dates[i + 1].getTime(),
            );
          }
        });
    });

    it('debe retornar reservas solo del usuario autenticado', async () => {
      // Crear otra reserva con otro usuario
      const otherUserRes = await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          email: 'other.customer@test.com',
          password: 'TestPassword123!',
          firstName: 'Other',
          lastName: 'Customer',
        })
        .expect(201);

      const otherLoginRes = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'other.customer@test.com',
          password: 'TestPassword123!',
        })
        .expect(200);

      const otherToken = otherLoginRes.body.data.accessToken;

      // Crear mesa adicional para evitar conflicto
      const tableRes = await request(app.getHttpServer())
        .post(`/v1/locations/${locationId}/tables`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          number: 'A2',
          capacity: 4,
        })
        .expect(201);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 8);

      // Crear reserva con otro usuario
      await request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          tableId: tableRes.body.data.id,
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '19:30',
          guestCount: 2,
        })
        .expect(201);

      // Verificar que el usuario original no ve la reserva del otro
      return request(app.getHttpServer())
        .get('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200)
        .expect((res) => {
          res.body.data.forEach((r) => {
            expect(r.user.id).toBe(customerId);
          });
        });
    });
  });

  // ============================================================================
  // GET - Obtener Reserva por ID
  // ============================================================================
  describe('GET /v1/reservations/:id - Obtener reserva', () => {
    it('debe retornar detalles completos de la reserva', () => {
      return request(app.getHttpServer())
        .get(`/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.id).toBe(reservationId);
          expect(res.body.data).toHaveProperty('user');
          expect(res.body.data).toHaveProperty('table');
          expect(res.body.data).toHaveProperty('restaurant');
          expect(res.body.data).toHaveProperty('location');
          expect(res.body.data).toHaveProperty('reservationDate');
          expect(res.body.data).toHaveProperty('reservationTime');
          expect(res.body.data).toHaveProperty('guestCount');
          expect(res.body.data).toHaveProperty('status');
        });
    });

    it('debe retornar 404 para ID no existente', () => {
      return request(app.getHttpServer())
        .get('/v1/reservations/nonexistent-id')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.error).toBe('RESERVATION_NOT_FOUND');
        });
    });

    it('debe retornar 401 sin autenticación', () => {
      return request(app.getHttpServer())
        .get(`/v1/reservations/${reservationId}`)
        .expect(401);
    });

    it('debe retornar 403 si no es el propietario', async () => {
      const otherUserRes = await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          email: 'other.user2@test.com',
          password: 'TestPassword123!',
          firstName: 'Other',
          lastName: 'User',
        })
        .expect(201);

      const otherLoginRes = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'other.user2@test.com',
          password: 'TestPassword123!',
        })
        .expect(200);

      const otherToken = otherLoginRes.body.data.accessToken;

      return request(app.getHttpServer())
        .get(`/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403)
        .expect((res) => {
          expect(res.body.error).toBe('FORBIDDEN');
        });
    });
  });

  // ============================================================================
  // PUT - Actualizar Reserva
  // ============================================================================
  describe('PUT /v1/reservations/:id - Actualizar reserva', () => {
    it('debe actualizar fecha y hora correctamente', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);

      return request(app.getHttpServer())
        .put(`/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '20:00',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.reservationTime).toBe('20:00');
        });
    });

    it('debe actualizar número de comensales', () => {
      return request(app.getHttpServer())
        .put(`/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guestCount: 3,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.guestCount).toBe(3);
        });
    });

    it('debe rechazar si nuevos comensales exceden capacidad', () => {
      return request(app.getHttpServer())
        .put(`/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guestCount: 10, // Mesa tiene capacidad 4
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('INVALID_GUEST_COUNT');
        });
    });

    it('debe retornar 404 para ID no existente', () => {
      return request(app.getHttpServer())
        .put('/v1/reservations/nonexistent-id')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guestCount: 2,
        })
        .expect(404);
    });

    it('debe retornar 401 sin autenticación', () => {
      return request(app.getHttpServer())
        .put(`/v1/reservations/${reservationId}`)
        .send({
          guestCount: 2,
        })
        .expect(401);
    });

    it('debe retornar 403 si no es el propietario', async () => {
      const otherToken = (
        await request(app.getHttpServer())
          .post('/v1/auth/login')
          .send({
            email: 'other.user2@test.com',
            password: 'TestPassword123!',
          })
          .expect(200)
      ).body.data.accessToken;

      return request(app.getHttpServer())
        .put(`/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          guestCount: 2,
        })
        .expect(403);
    });

    it('debe rechazar actualización en fecha pasada', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      return request(app.getHttpServer())
        .put(`/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          reservationDate: pastDate.toISOString().split('T')[0],
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('INVALID_RESERVATION_DATE');
        });
    });

    it('debe verificar disponibilidad de la nueva mesa asignada', async () => {
      // Crear nueva mesa
      const newTableRes = await request(app.getHttpServer())
        .post(`/v1/locations/${locationId}/tables`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          number: 'A3',
          capacity: 4,
        })
        .expect(201);

      const newTableId = newTableRes.body.data.id;

      // Actualizar a nueva mesa
      return request(app.getHttpServer())
        .put(`/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tableId: newTableId,
        })
        .expect(200);
    });
  });

  // ============================================================================
  // DELETE - Cancelar Reserva
  // ============================================================================
  describe('DELETE /v1/reservations/:id - Cancelar reserva', () => {
    let cancelReservationId: string;

    beforeEach(async () => {
      // Crear una nueva reserva para cancelar
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      const res = await request(app.getHttpServer())
        .post('/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tableId,
          reservationDate: futureDate.toISOString().split('T')[0],
          reservationTime: '18:00',
          guestCount: 2,
        })
        .expect(201);

      cancelReservationId = res.body.data.id;
    });

    it('debe cancelar una reserva existente', () => {
      return request(app.getHttpServer())
        .delete(`/v1/reservations/${cancelReservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data.status).toBe('CANCELLED');
        });
    });

    it('debe marcar mesa como AVAILABLE después de cancelar', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/reservations/${cancelReservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      // Verificar que la mesa esté disponible nuevamente
      return request(app.getHttpServer())
        .get(`/v1/locations/${locationId}/tables/${tableId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.status).toBe('AVAILABLE');
        });
    });

    it('debe retornar 404 para ID no existente', () => {
      return request(app.getHttpServer())
        .delete('/v1/reservations/nonexistent-id')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(404);
    });

    it('debe retornar 401 sin autenticación', () => {
      return request(app.getHttpServer())
        .delete(`/v1/reservations/${cancelReservationId}`)
        .expect(401);
    });

    it('debe retornar 403 si no es el propietario', async () => {
      const otherToken = (
        await request(app.getHttpServer())
          .post('/v1/auth/login')
          .send({
            email: 'other.user2@test.com',
            password: 'TestPassword123!',
          })
          .expect(200)
      ).body.data.accessToken;

      return request(app.getHttpServer())
        .delete(`/v1/reservations/${cancelReservationId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);
    });

    it('debe retornar 400 si ya está cancelada', async () => {
      // Cancelar primero
      await request(app.getHttpServer())
        .delete(`/v1/reservations/${cancelReservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      // Intentar cancelar de nuevo
      return request(app.getHttpServer())
        .delete(`/v1/reservations/${cancelReservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('INVALID_RESERVATION_STATUS');
        });
    });
  });
});
