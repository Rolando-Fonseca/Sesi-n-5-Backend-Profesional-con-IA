/**
 * Test Utilities - Helpers para pruebas E2E
 * Contiene funciones reutilizables para setup, cleanup y assertions
 */

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from 'src/database/prisma.service';

/**
 * Interface para respuesta estándar del API
 */
export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
  };
}

/**
 * Interface para usuario de prueba
 */
export interface TestUser {
  id: string;
  email: string;
  token: string;
  refreshToken: string;
}

// ============================================================================
// AUTH HELPERS
// ============================================================================

/**
 * Registrar y obtener token de usuario
 */
export async function createTestUser(
  app: INestApplication,
  email: string,
  password: string = 'TestPassword123!',
  role: 'CUSTOMER' | 'STAFF' | 'ADMIN' = 'CUSTOMER',
): Promise<TestUser> {
  // Registrar
  const registerRes = await request(app.getHttpServer())
    .post('/v1/auth/register')
    .send({
      email,
      password,
      firstName: 'Test',
      lastName: 'User',
      phone: '+51912345678',
      role,
    })
    .expect(201);

  const userId = registerRes.body.data.user.id;

  // Login
  const loginRes = await request(app.getHttpServer())
    .post('/v1/auth/login')
    .send({
      email,
      password,
    })
    .expect(200);

  return {
    id: userId,
    email,
    token: loginRes.body.data.accessToken,
    refreshToken: loginRes.body.data.refreshToken,
  };
}

/**
 * Login con email/password existente
 */
export async function loginUser(
  app: INestApplication,
  email: string,
  password: string,
): Promise<TestUser> {
  const res = await request(app.getHttpServer())
    .post('/v1/auth/login')
    .send({ email, password })
    .expect(200);

  return {
    id: res.body.data.user.id,
    email,
    token: res.body.data.accessToken,
    refreshToken: res.body.data.refreshToken,
  };
}

/**
 * Refrescar token
 */
export async function refreshToken(
  app: INestApplication,
  refreshToken: string,
): Promise<string> {
  const res = await request(app.getHttpServer())
    .post('/v1/auth/refresh-token')
    .send({ refreshToken })
    .expect(200);

  return res.body.data.accessToken;
}

// ============================================================================
// RESTAURANT HELPERS
// ============================================================================

export interface CreateRestaurantData {
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  cuisineType?: string;
}

/**
 * Crear restaurante de prueba
 */
export async function createTestRestaurant(
  app: INestApplication,
  adminToken: string,
  data: Partial<CreateRestaurantData> = {},
): Promise<{ id: string; name: string; email: string }> {
  const defaults: CreateRestaurantData = {
    name: `Test Restaurant ${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    phone: '+51912345678',
    description: 'Test restaurant',
  };

  const res = await request(app.getHttpServer())
    .post('/v1/restaurants')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ...defaults, ...data })
    .expect(201);

  return {
    id: res.body.data.id,
    name: res.body.data.name,
    email: res.body.data.email,
  };
}

/**
 * Crear múltiples restaurantes
 */
export async function createTestRestaurants(
  app: INestApplication,
  adminToken: string,
  count: number = 3,
): Promise<Array<{ id: string; name: string }>> {
  const restaurants = [];

  for (let i = 0; i < count; i++) {
    const restaurant = await createTestRestaurant(app, adminToken, {
      name: `Restaurant ${i + 1} ${Date.now()}`,
    });
    restaurants.push(restaurant);
  }

  return restaurants;
}

// ============================================================================
// LOCATION HELPERS
// ============================================================================

export interface CreateLocationData {
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  openingTime?: string;
  closingTime?: string;
}

/**
 * Crear ubicación de prueba
 */
export async function createTestLocation(
  app: INestApplication,
  restaurantId: string,
  adminToken: string,
  data: Partial<CreateLocationData> = {},
): Promise<{ id: string; address: string }> {
  const defaults: CreateLocationData = {
    address: `Test Address ${Date.now()}`,
    city: 'Lima',
    state: 'Lima',
    postalCode: '15001',
    country: 'Peru',
    openingTime: '11:00',
    closingTime: '23:00',
  };

  const res = await request(app.getHttpServer())
    .post(`/v1/restaurants/${restaurantId}/locations`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ...defaults, ...data })
    .expect(201);

  return {
    id: res.body.data.id,
    address: res.body.data.address,
  };
}

// ============================================================================
// TABLE HELPERS
// ============================================================================

/**
 * Crear mesa de prueba
 */
export async function createTestTable(
  app: INestApplication,
  locationId: string,
  adminToken: string,
  number: string = `T${Date.now()}`,
  capacity: number = 4,
): Promise<{ id: string; number: string }> {
  const res = await request(app.getHttpServer())
    .post(`/v1/locations/${locationId}/tables`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      number,
      capacity,
      status: 'AVAILABLE',
    })
    .expect(201);

  return {
    id: res.body.data.id,
    number: res.body.data.number,
  };
}

/**
 * Crear múltiples mesas
 */
export async function createTestTables(
  app: INestApplication,
  locationId: string,
  adminToken: string,
  count: number = 5,
): Promise<Array<{ id: string; number: string }>> {
  const tables = [];

  for (let i = 1; i <= count; i++) {
    const table = await createTestTable(
      app,
      locationId,
      adminToken,
      `A${i}`,
      4 + i,
    );
    tables.push(table);
  }

  return tables;
}

// ============================================================================
// RESERVATION HELPERS
// ============================================================================

export interface CreateReservationData {
  tableId: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  specialRequests?: string;
}

/**
 * Crear reserva de prueba
 */
export async function createTestReservation(
  app: INestApplication,
  customerToken: string,
  data: CreateReservationData,
): Promise<{ id: string; status: string }> {
  const res = await request(app.getHttpServer())
    .post('/v1/reservations')
    .set('Authorization', `Bearer ${customerToken}`)
    .send(data)
    .expect(201);

  return {
    id: res.body.data.id,
    status: res.body.data.status,
  };
}

/**
 * Obtener fecha futura (días/horas desde ahora)
 */
export function getFutureDate(
  daysOffset: number = 7,
  hoursOffset: number = 0,
): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(date.getHours() + hoursOffset);
  return date.toISOString().split('T')[0];
}

/**
 * Obtener hora en formato HH:MM
 */
export function getTimeString(hours: number = 19, minutes: number = 30): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// ============================================================================
// CLEANUP HELPERS
// ============================================================================

/**
 * Limpiar usuario por email
 */
export async function deleteUserByEmail(
  prisma: PrismaService,
  email: string,
): Promise<void> {
  await prisma.user.deleteMany({
    where: { email },
  });
}

/**
 * Limpiar restaurante y todo lo relacionado
 */
export async function deleteRestaurant(
  prisma: PrismaService,
  restaurantId: string,
): Promise<void> {
  // Limpiar en orden respetando foreign keys
  await prisma.reservation.deleteMany({
    where: { table: { location: { restaurantId } } },
  });

  await prisma.orderItem.deleteMany({
    where: { order: { restaurantId } },
  });

  await prisma.order.deleteMany({
    where: { restaurantId },
  });

  await prisma.table.deleteMany({
    where: { location: { restaurantId } },
  });

  await prisma.location.deleteMany({
    where: { restaurantId },
  });

  await prisma.dish.deleteMany({
    where: { restaurantId },
  });

  await prisma.category.deleteMany({
    where: { restaurantId },
  });

  await prisma.review.deleteMany({
    where: { restaurantId },
  });

  await prisma.staffAssignment.deleteMany({
    where: { restaurantId },
  });

  await prisma.restaurant.delete({
    where: { id: restaurantId },
  });
}

/**
 * Limpiar todos los usuarios de prueba
 */
export async function deleteTestUsers(
  prisma: PrismaService,
  emailPattern: string,
): Promise<void> {
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: emailPattern,
      },
    },
  });
}

// ============================================================================
// ASSERTION HELPERS
// ============================================================================

/**
 * Validar estructura de respuesta estándar
 */
export function expectApiResponse<T = any>(
  response: any,
  statusCode: number,
  hasData: boolean = true,
): void {
  expect(response.statusCode).toBe(statusCode);
  expect(response).toHaveProperty('message');

  if (hasData) {
    expect(response).toHaveProperty('data');
  }
}

/**
 * Validar estructura de error
 */
export function expectApiError(
  response: any,
  statusCode: number,
  errorCode: string,
): void {
  expect(response.statusCode).toBe(statusCode);
  expect(response).toHaveProperty('error');
  expect(response).toHaveProperty('message');
  expect(response.error).toBe(errorCode);
}

/**
 * Validar paginación
 */
export function expectPagination(
  response: any,
  expectedLimit: number = 10,
  expectedOffset: number = 0,
): void {
  expect(response.pagination).toBeDefined();
  expect(response.pagination.limit).toBe(expectedLimit);
  expect(response.pagination.offset).toBe(expectedOffset);
  expect(response.pagination).toHaveProperty('total');
  expect(response.pagination).toHaveProperty('pages');
}

/**
 * Validar objeto restaurante
 */
export function expectRestaurantObject(restaurant: any): void {
  expect(restaurant).toHaveProperty('id');
  expect(restaurant).toHaveProperty('name');
  expect(restaurant).toHaveProperty('email');
  expect(restaurant).toHaveProperty('phone');
  expect(restaurant).toHaveProperty('createdAt');
  expect(restaurant).toHaveProperty('updatedAt');
}

/**
 * Validar objeto reserva
 */
export function expectReservationObject(reservation: any): void {
  expect(reservation).toHaveProperty('id');
  expect(reservation).toHaveProperty('user');
  expect(reservation).toHaveProperty('table');
  expect(reservation).toHaveProperty('reservationDate');
  expect(reservation).toHaveProperty('reservationTime');
  expect(reservation).toHaveProperty('guestCount');
  expect(reservation).toHaveProperty('status');
  expect(reservation).toHaveProperty('createdAt');
  expect(reservation).toHaveProperty('updatedAt');
}

/**
 * Validar tokens JWT
 */
export function expectValidToken(token: string): void {
  // Token debe tener 3 partes separadas por puntos
  const parts = token.split('.');
  expect(parts).toHaveLength(3);

  // Cada parte debe ser base64 válida
  parts.forEach((part) => {
    expect(() => Buffer.from(part, 'base64').toString('utf8')).not.toThrow();
  });
}

// ============================================================================
// UTILITY HELPERS
// ============================================================================

/**
 * Esperar un tiempo (para testing asincrónico)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generar email único
 */
export function generateEmail(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}@test.com`;
}

/**
 * Generar nombre único
 */
export function generateName(prefix: string = 'Test'): string {
  return `${prefix} ${Date.now()}`;
}

/**
 * Obtener primer página de results
 */
export function getFirstPageResults<T>(
  response: any,
): T[] {
  return response.body?.data || [];
}

/**
 * Obtener primer resultado
 */
export function getFirstResult<T>(response: any): T | null {
  const results = getFirstPageResults<T>(response);
  return results.length > 0 ? results[0] : null;
}
