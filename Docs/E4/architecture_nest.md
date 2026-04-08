# Arquitectura NestJS - Restaurantes Backend

**Versión**: 1.0  
**Framework**: NestJS 10.x  
**TypeScript**: 5.x  
**Database**: PostgreSQL 15+  
**ORM**: Prisma 5.x  
**Testing**: Jest + Supertest  
**Última actualización**: 8 de abril de 2026

---

## Tabla de Contenidos

1. [Estructura de Carpetas](#estructura-de-carpetas)
2. [Módulos Principales](#módulos-principales)
3. [Servicios y Responsabilidades](#servicios-y-responsabilidades)
4. [DTOs y Validaciones](#dtos-y-validaciones)
5. [Controladores](#controladores)
6. [Decoradores Swagger](#decoradores-swagger)
7. [ORM: Prisma 5.x](#orm-prisma-5x)
8. [Testing: Jest + Supertest](#testing-jest--supertest)
9. [Middleware y Guardias](#middleware-y-guardias)
10. [Inyección de Dependencias](#inyección-de-dependencias)
11. [Flujos de Datos](#flujos-de-datos)

---

## Estructura de Carpetas

```
restaurants-backend/
├── src/
│   ├── app.module.ts                    # Módulo raíz
│   ├── app.controller.ts                # Health check
│   ├── main.ts                          # Punto de entrada
│   │
│   ├── common/                          # Código compartido
│   │   ├── decorators/                  # Decoradores personalizados
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── api-response.decorator.ts
│   │   │
│   │   ├── exceptions/                  # Excepciones personalizadas
│   │   │   ├── api.exception.ts
│   │   │   ├── validation.exception.ts
│   │   │   └── not-found.exception.ts
│   │   │
│   │   ├── filters/                     # Filtros globales
│   │   │   ├── http-exception.filter.ts
│   │   │   └── rpc-exception.filter.ts
│   │   │
│   │   ├── guards/                      # Guardias de autenticación
│   │   │   ├── jwt.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── owner.guard.ts
│   │   │
│   │   ├── interceptors/                # Interceptores
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   │
│   │   ├── middleware/                  # Middleware
│   │   │   ├── request-logger.middleware.ts
│   │   │   └── request-timeout.middleware.ts
│   │   │
│   │   ├── utils/                       # Funciones utilitarias
│   │   │   ├── validators.ts
│   │   │   ├── formatters.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── pipes/                       # Tuberías personalizadas
│   │   │   ├── validation.pipe.ts
│   │   │   └── parse-id.pipe.ts
│   │   │
│   │   └── types/                       # Tipos compartidos
│   │       ├── api-response.type.ts
│   │       ├── pagination.type.ts
│   │       └── user-context.type.ts
│   │
│   ├── auth/                            # Módulo de autenticación
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── local.strategy.ts
│   │   │
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       ├── login.dto.ts
│   │       ├── refresh-token.dto.ts
│   │       └── auth-response.dto.ts
│   │
│   ├── users/                           # Módulo de usuarios
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   │
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   │
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       ├── update-user.dto.ts
│   │       ├── update-password.dto.ts
│   │       └── user-response.dto.ts
│   │
│   ├── restaurants/                     # Módulo de restaurantes
│   │   ├── restaurants.module.ts
│   │   ├── restaurants.controller.ts
│   │   ├── restaurants.service.ts
│   │   ├── restaurants.repository.ts
│   │   │
│   │   ├── entities/
│   │   │   └── restaurant.entity.ts
│   │   │
│   │   ├── dto/
│   │   │   ├── create-restaurant.dto.ts
│   │   │   ├── update-restaurant.dto.ts
│   │   │   ├── restaurant-response.dto.ts
│   │   │   └── restaurant-filter.dto.ts
│   │   │
│   │   └── services/
│   │       ├── restaurant-search.service.ts
│   │       └── restaurant-analytics.service.ts
│   │
│   ├── locations/                       # Módulo de ubicaciones
│   │   ├── locations.module.ts
│   │   ├── locations.controller.ts
│   │   ├── locations.service.ts
│   │   ├── locations.repository.ts
│   │   │
│   │   ├── entities/
│   │   │   └── location.entity.ts
│   │   │
│   │   ├── dto/
│   │   │   ├── create-location.dto.ts
│   │   │   ├── update-location.dto.ts
│   │   │   └── location-response.dto.ts
│   │   │
│   │   └── services/
│   │       └── location-geo.service.ts
│   │
│   ├── categories/                      # Módulo de categorías
│   │   ├── categories.module.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   ├── categories.repository.ts
│   │   │
│   │   ├── entities/
│   │   │   └── category.entity.ts
│   │   │
│   │   └── dto/
│   │       ├── create-category.dto.ts
│   │       ├── update-category.dto.ts
│   │       └── category-response.dto.ts
│   │
│   ├── dishes/                          # Módulo de platos
│   │   ├── dishes.module.ts
│   │   ├── dishes.controller.ts
│   │   ├── dishes.service.ts
│   │   ├── dishes.repository.ts
│   │   │
│   │   ├── entities/
│   │   │   └── dish.entity.ts
│   │   │
│   │   ├── dto/
│   │   │   ├── create-dish.dto.ts
│   │   │   ├── update-dish.dto.ts
│   │   │   ├── dish-response.dto.ts
│   │   │   └── dish-filter.dto.ts
│   │   │
│   │   └── services/
│   │       ├── dish-search.service.ts
│   │       └── dish-availability.service.ts
│   │
│   ├── orders/                          # Módulo de órdenes
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── orders.repository.ts
│   │   │
│   │   ├── entities/
│   │   │   ├── order.entity.ts
│   │   │   └── order-item.entity.ts
│   │   │
│   │   ├── dto/
│   │   │   ├── create-order.dto.ts
│   │   │   ├── update-order-status.dto.ts
│   │   │   ├── order-response.dto.ts
│   │   │   └── order-filter.dto.ts
│   │   │
│   │   └── services/
│   │       ├── order-processor.service.ts
│   │       ├── order-status-manager.service.ts
│   │       ├── payment.service.ts
│   │       └── discount.service.ts
│   │
│   ├── reservations/                    # Módulo de reservas
│   │   ├── reservations.module.ts
│   │   ├── reservations.controller.ts
│   │   ├── reservations.service.ts
│   │   ├── reservations.repository.ts
│   │   │
│   │   ├── entities/
│   │   │   └── reservation.entity.ts
│   │   │
│   │   ├── dto/
│   │   │   ├── create-reservation.dto.ts
│   │   │   ├── update-reservation.dto.ts
│   │   │   ├── reservation-response.dto.ts
│   │   │   └── reservation-filter.dto.ts
│   │   │
│   │   └── services/
│   │       ├── table-availability.service.ts
│   │       └── reservation-scheduler.service.ts
│   │
│   ├── reviews/                         # Módulo de reseñas
│   │   ├── reviews.module.ts
│   │   ├── reviews.controller.ts
│   │   ├── reviews.service.ts
│   │   ├── reviews.repository.ts
│   │   │
│   │   ├── entities/
│   │   │   └── review.entity.ts
│   │   │
│   │   ├── dto/
│   │   │   ├── create-review.dto.ts
│   │   │   ├── update-review.dto.ts
│   │   │   ├── review-response.dto.ts
│   │   │   └── review-filter.dto.ts
│   │   │
│   │   └── services/
│   │       └── review-moderator.service.ts
│   │
│   ├── staff/                           # Módulo de personal
│   │   ├── staff.module.ts
│   │   ├── staff.controller.ts
│   │   ├── staff.service.ts
│   │   ├── staff.repository.ts
│   │   │
│   │   ├── entities/
│   │   │   └── staff-assignment.entity.ts
│   │   │
│   │   └── dto/
│   │       ├── create-staff-assignment.dto.ts
│   │       ├── update-staff-assignment.dto.ts
│   │       └── staff-response.dto.ts
│   │
│   ├── tables/                          # Módulo de mesas
│   │   ├── tables.module.ts
│   │   ├── tables.controller.ts
│   │   ├── tables.service.ts
│   │   ├── tables.repository.ts
│   │   │
│   │   ├── entities/
│   │   │   └── table.entity.ts
│   │   │
│   │   └── dto/
│   │       ├── create-table.dto.ts
│   │       ├── update-table.dto.ts
│   │       └── table-response.dto.ts
│   │
│   ├── database/                        # Configuración de base de datos
│   │   ├── database.module.ts
│   │   ├── prisma.service.ts
│   │   └── migrations/
│   │       └── (gestionadas por Prisma)
│   │
│   ├── prisma/                         # Schema y migraciones Prisma
│   │   ├── schema.prisma               # Definición del modelo de datos
│   │   ├── seed.ts                     # Seeding de datos
│   │   └── migrations/                 # Migraciones automáticas
│   │
│   ├── config/                          # Configuración global
│   │   ├── config.module.ts
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│   │
│   └── queue/                           # Procesamiento asincrónico (Bull)
│       ├── queue.module.ts
│       ├── jobs/
│       │   ├── send-email.job.ts
│       │   ├── generate-report.job.ts
│       │   └── cleanup-reservations.job.ts
│       └── processors/
│           ├── email.processor.ts
│           ├── report.processor.ts
│           └── maintenance.processor.ts
│
├── test/                                # Tests E2E
│   ├── auth.e2e-spec.ts
│   ├── restaurants.e2e-spec.ts
│   ├── orders.e2e-spec.ts
│   └── jest-e2e.json
│
├── __tests__/                           # Tests unitarios (opcional)
│   ├── users/
│   │   └── users.service.spec.ts
│   ├── restaurants/
│   │   └── restaurants.service.spec.ts
│   └── orders/
│       └── orders.service.spec.ts
│
├── .env.example
├── .env.development
├── .env.production
├── docker-compose.yml
├── Dockerfile
├── jest.config.js                      # Configuración Jest
├── jest-e2e.config.js                  # Jest para E2E
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## Módulos Principales

### 1. **Auth Module** `(src/auth/)`

Gestiona autenticación y autorización.

**Responsabilidades:**
- Registrar nuevos usuarios
- Autenticar con email/contraseña
- Generar y validar JWT tokens
- Renovar tokens expirados
- Implementar estrategias Passport (JWT, Local)

**Dependencias:**
- `UsersService` — Acceso a datos de usuarios
- `JwtService` — Generación de tokens
- `ConfigService` — Variables de entorno

**Controlador: `auth.controller.ts`**
```typescript
// Rutas
POST   /auth/register          - registerUser()
POST   /auth/login             - login()
POST   /auth/refresh-token     - refreshToken()
GET    /auth/me                - getProfile()
```

---

### 2. **Users Module** `(src/users/)`

Gestión de perfiles y datos de usuarios.

**Responsabilidades:**
- CRUD de usuarios
- Actualizar perfil
- Cambiar contraseña
- Gestionar roles (customer, staff, admin)
- Validar integridad de datos

**Servicios:**
- `UsersService` — Lógica de negocio
- `UsersRepository` — Queries a BD

**Controlador: `users.controller.ts`**
```typescript
// Rutas
GET    /users/:id              - getUser()
PUT    /users/:id              - updateUser()
PUT    /users/:id/password     - changePassword()
```

---

### 3. **Restaurants Module** `(src/restaurants/)`

Gestión de restaurantes y su información.

**Responsabilidades:**
- CRUD de restaurantes
- Búsqueda y filtrado avanzado
- Cálculo de ratings
- Validar propiedad/permisos
- Incluir relaciones (ubicaciones, platos, reseñas)

**Servicios:**
- `RestaurantsService` — Lógica principal
- `RestaurantsRepository` — Queries complejas
- `RestaurantSearchService` — Búsqueda y filtrado
- `RestaurantAnalyticsService` — Cálculos de estadísticas

**Controlador: `restaurants.controller.ts`**
```typescript
// Rutas
POST   /restaurants            - createRestaurant()
GET    /restaurants            - listRestaurants()
GET    /restaurants/:id        - getRestaurant()
PUT    /restaurants/:id        - updateRestaurant()
DELETE /restaurants/:id        - deleteRestaurant()
```

---

### 4. **Locations Module** `(src/locations/)`

Gestión de múltiples ubicaciones por restaurante.

**Responsabilidades:**
- CRUD de ubicaciones
- Validar ubicación primaria por restaurante
- Manejo de coordenadas GPS
- Validar no hay órdenes activas antes de eliminar

**Servicios:**
- `LocationsService` — Lógica
- `LocationsRepository` — Queries
- `LocationGeoService` — Búsquedas por proximidad

**Controlador: `locations.controller.ts`**
```typescript
// Rutas
POST   /restaurants/:id/locations       - createLocation()
GET    /restaurants/:id/locations       - listLocations()
PUT    /locations/:id                   - updateLocation()
DELETE /locations/:id                   - deleteLocation()
```

---

### 5. **Categories Module** `(src/categories/)`

Gestión de categorías de menú.

**Responsabilidades:**
- CRUD de categorías
- Ordenamiento visual (display_order)
- Validar nombre único por restaurante
- Verificar dependencias antes de eliminar

**Servicios:**
- `CategoriesService` — Lógica
- `CategoriesRepository` — Queries

**Controlador:** Incluido en `RestaurantsController` o endpoint dedicado
```typescript
// Rutas
POST   /restaurants/:id/categories      - createCategory()
GET    /restaurants/:id/categories      - listCategories()
PUT    /categories/:id                  - updateCategory()
DELETE /categories/:id                  - deleteCategory()
```

---

### 6. **Dishes Module** `(src/dishes/)`

Gestión del catálogo de platos.

**Responsabilidades:**
- CRUD de platos
- Búsqueda por nombre, precio, disponibilidad
- Validar categoría existe
- Validar no hay órdenes antes de eliminar
- Información de alérgenos e ingredientes

**Servicios:**
- `DishesService` — Lógica principal
- `DishesRepository` — Queries
- `DishSearchService` — Búsqueda avanzada
- `DishAvailabilityService` — Control de disponibilidad

**Controlador: `dishes.controller.ts`**
```typescript
// Rutas
POST   /restaurants/:id/dishes          - createDish()
GET    /restaurants/:id/dishes          - listDishes()
GET    /dishes/:id                      - getDish()
PUT    /dishes/:id                      - updateDish()
DELETE /dishes/:id                      - deleteDish()
```

---

### 7. **Orders Module** `(src/orders/)`

Gestión completa de órdenes/pedidos.

**Responsabilidades:**
- CRUD de órdenes
- Crear order items
- Transiciones de estado (pending → confirmed → preparing → ready → delivered)
- Cálculo de totales y descuentos
- Procesamiento de pagos
- Cancelación y reembolsos

**Servicios:**
- `OrdersService` — Orquestación principal
- `OrdersRepository` — Queries complejas
- `OrderProcessorService` — Creación y validación
- `OrderStatusManagerService` — Transiciones de estado
- `PaymentService` — Integración de pagos
- `DiscountService` — Validación de códigos

**Controlador: `orders.controller.ts`**
```typescript
// Rutas
POST   /orders                          - createOrder()
GET    /orders                          - listUserOrders()
GET    /orders/:id                      - getOrder()
PUT    /orders/:id                      - updateOrderStatus()
DELETE /orders/:id                      - cancelOrder()
```

---

### 8. **Reservations Module** `(src/reservations/)`

Sistema de reservas de mesas.

**Responsabilidades:**
- CRUD de reservas
- Validar disponibilidad de mesa
- Validar capacidad vs comensales
- Transiciones de estado
- Scheduler para limpiar reservas vencidas

**Servicios:**
- `ReservationsService` — Lógica principal
- `ReservationsRepository` — Queries
- `TableAvailabilityService` — Validar disponibilidad
- `ReservationSchedulerService` — Jobs de limpieza

**Controlador: `reservations.controller.ts`**
```typescript
// Rutas
POST   /restaurants/:id/reservations    - createReservation()
GET    /reservations                    - listUserReservations()
GET    /reservations/:id                - getReservation()
PUT    /reservations/:id                - updateReservation()
DELETE /reservations/:id                - cancelReservation()
```

---

### 9. **Tables Module** `(src/tables/)`

Gestión de mesas en ubicaciones.

**Responsabilidades:**
- CRUD de mesas
- Validar número único por ubicación
- Gestionar estado (available, occupied, reserved, maintenance)
- Actualizar capacidad

**Servicios:**
- `TablesService` — Lógica
- `TablesRepository` — Queries

**Controlador:** Incluido en `LocationsController`
```typescript
// Rutas
POST   /locations/:id/tables            - createTable()
GET    /locations/:id/tables            - listTables()
PUT    /tables/:id                      - updateTable()
DELETE /tables/:id                      - deleteTable()
```

---

### 10. **Reviews Module** `(src/reviews/)`

Sistema de reseñas y calificaciones.

**Responsabilidades:**
- CRUD de reseñas (1-5 estrellas)
- Validar una reseña por usuario/restaurante
- Marcar como verificado si hay orden
- Contar votos útiles
- Moderar contenido (opcional)

**Servicios:**
- `ReviewsService` — Lógica
- `ReviewsRepository` — Queries
- `ReviewModeratorService` — Validación de contenido (spam, lenguaje)

**Controlador: `reviews.controller.ts`**
```typescript
// Rutas
POST   /restaurants/:id/reviews         - createReview()
GET    /restaurants/:id/reviews         - listReviews()
PUT    /reviews/:id                     - updateReview()
DELETE /reviews/:id                     - deleteReview()
POST   /reviews/:id/helpful             - markHelpful()
```

---

### 11. **Staff Module** `(src/staff/)`

Gestión de asignaciones de personal.

**Responsabilidades:**
- CRUD de asignaciones
- Validar usuario es staff/admin
- Registrar fecha de contratación/desvinculación
- Listar personal activo por restaurante

**Servicios:**
- `StaffService` — Lógica
- `StaffRepository` — Queries

**Controlador: `staff.controller.ts`**
```typescript
// Rutas
POST   /restaurants/:id/staff           - assignStaff()
GET    /restaurants/:id/staff           - listStaff()
PUT    /staff-assignments/:id           - updateAssignment()
DELETE /staff-assignments/:id           - removeStaff()
```

---

### 12. **Database Module** `(src/database/)`

Configuración de Prisma y gestión de conexión.

**Responsabilidades:**
- Conectar a PostgreSQL via Prisma
- Proporcionar cliente Prisma a los servicios
- Manejar migraciones (gestionadas por Prisma)
- Gestionar ciclo de vida de conexión

**Contenido:**
- `database.module.ts` — Global provider de Prisma
- `prisma.service.ts` — Servicio wrapper de Prisma Client

---

### 13. **Config Module** `(src/config/)`

Variables de entorno y configuración global.

**Responsabilidades:**
- Cargar .env según ambiente
- Exportar variables tipadas
- Validar variables requeridas

**Variables Principales:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/restaurants
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=3600
NODE_ENV=development
API_PORT=3000
STRIPE_API_KEY=sk_test_...
SENDGRID_API_KEY=SG...
```

---

### 14. **Queue Module** `(src/queue/)`

Procesamiento asincrónico con Bull.

**Responsabilidades:**
- Envío de emails de confirmación
- Generación de reportes
- Limpieza de reservas vencidas
- Cálculo de estadísticas

**Jobs:**
- `SendEmailJob` — Confirmaciones, resetear contraseña
- `GenerateReportJob` — Reportes de ventas
- `CleanupReservationsJob` — Eliminar reservas vencidas

---

## Servicios y Responsabilidades

### Patrón: Service + Repository

Cada módulo sigue este patrón:

```
Controller
    ↓ (Recibe HTTP Request)
Service
    ↓ (Lógica de negocio)
Repository
    ↓ (Queries a BD)
Entity/Database
```

### Ejemplo: `RestaurantsService`

**Responsabilidades:**
1. Validar permisos (solo admin puede crear)
2. Llamar a repository para insertar
3. Calcular relacionados (ubicaciones, platos, rating)
4. Manejar errores y excepciones
5. Auditar creación

**No debe:**
- Hacer queries SQL directas
- Acceder a HTTP context
- Formatear respuestas (lo hace interceptor)

---

## DTOs y Validaciones

### Principios

1. **Uno por caso de uso** — `CreateRestaurantDto`, `UpdateRestaurantDto`
2. **Validadores de clase** — `class-validator`
3. **Transformers** — `class-transformer` para conversión de tipos
4. **Separación** — DTOs de entrada vs salida

### Ejemplo: `CreateRestaurantDto`

```typescript
import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CreateRestaurantDto {
  
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  cuisineType: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}
```

### Ejemplo: `ListRestaurantsQueryDto`

```typescript
import { IsNumber, IsOptional, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ListRestaurantsQueryDto {
  
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number = 0;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  cuisineType?: string;

  @IsOptional()
  @IsEnum(['name', 'rating', 'createdAt'])
  sortBy?: string = 'name';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: string = 'asc';
}
```

### Ejemplo: `CreateOrderDto` (Complejo)

```typescript
import { IsArray, ValidateNested, IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNumber()
  dishId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class CreateOrderDto {
  @IsNumber()
  restaurantId: number;

  @IsNumber()
  locationId: number;

  @IsEnum(['dine-in', 'takeout', 'delivery'])
  orderType: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  discountCode?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;
}
```

### Ejemplo: `RestaurantResponseDto` (Salida)

```typescript
import { Exclude } from 'class-transformer';

export class RestaurantResponseDto {
  id: number;
  name: string;
  description: string;
  cuisineType: string;
  email: string;
  phone: string;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  deletedAt?: Date;

  // Relaciones completas
  locations?: LocationResponseDto[];
  dishes?: DishResponseDto[];
  staff?: StaffResponseDto[];
}
```

---

## Controladores

### Principios de Diseño

1. **Una responsabilidad** — Un recurso = Un controlador
2. **Enrutamiento claro** — Siguiendo REST conventions
3. **Validación en DTO** — No en controlador
4. **Guardias en controlador** — Como decoradores `@UseGuards()`
5. **Status codes correctos** — 200, 201, 204, 400, 401, 403, 404, 409

### Ejemplo: `RestaurantsController`

```typescript
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ListRestaurantsQueryDto } from './dto/list-restaurants-query.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { OwnerGuard } from '../common/guards/owner.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('restaurants')
@UseGuards(JwtGuard)
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.restaurantsService.create(createRestaurantDto, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() queryDto: ListRestaurantsQueryDto) {
    return this.restaurantsService.findAll(queryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    return this.restaurantsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(OwnerGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto, user.id);
  }

  @Delete(':id')
  @UseGuards(OwnerGuard)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: UserContext,
  ) {
    return this.restaurantsService.remove(id, user.id);
  }
}
```

---

## Decoradores Swagger

### Configuración Global en main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Restaurants API')
    .setDescription('API REST para gestión de restaurantes, órdenes y reservas')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .addTag('Auth', 'Autenticación y autorización')
    .addTag('Users', 'Gestión de usuarios')
    .addTag('Restaurants', 'Gestión de restaurantes')
    .addTag('Locations', 'Ubicaciones de restaurantes')
    .addTag('Dishes', 'Catálogo de platos')
    .addTag('Orders', 'Órdenes y pedidos')
    .addTag('Reservations', 'Sistema de reservas')
    .addTag('Reviews', 'Reseñas y calificaciones')
    .addTag('Staff', 'Gestión de personal')
    .setContact('API Team', 'https://example.com', 'api@example.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
    },
  });

  await app.listen(process.env.API_PORT || 3000);
}

bootstrap();
```

**URL de acceso**: `http://localhost:3000/api-docs`

---

### Controlador Completo con Swagger

```typescript
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  HttpCode as ApiHttpCode,
} from '@nestjs/swagger';

import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ListRestaurantsQueryDto } from './dto/list-restaurants-query.dto';
import { RestaurantResponseDto } from './dto/restaurant-response.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { OwnerGuard } from '../common/guards/owner.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Restaurants')
@ApiBearerAuth('jwt')
@Controller('restaurants')
@UseGuards(JwtGuard)
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nuevo restaurante',
    description: 'Solo administradores pueden crear restaurantes. Se asigna como propietario.',
  })
  @ApiBody({
    type: CreateRestaurantDto,
    description: 'Datos del nuevo restaurante',
    examples: {
      example1: {
        summary: 'Restaurante mexicano',
        value: {
          name: 'La Esquina',
          description: 'Restaurante de comida mexicana tradicional',
          cuisineType: 'Mexican',
          email: 'info@laesquina.com',
          phone: '+5215512345678',
          websiteUrl: 'https://laesquina.com',
          logoUrl: 'https://cdn.example.com/logos/laesquina.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Restaurante creado exitosamente',
    type: RestaurantResponseDto,
    example: {
      success: true,
      data: {
        id: 1,
        name: 'La Esquina',
        description: 'Restaurante de comida mexicana tradicional',
        cuisineType: 'Mexican',
        ownerId: 5,
        email: 'info@laesquina.com',
        phone: '+5215512345678',
        websiteUrl: 'https://laesquina.com',
        logoUrl: 'https://cdn.example.com/logos/laesquina.jpg',
        rating: 0.0,
        isActive: true,
        createdAt: '2026-04-07T14:30:00Z',
      },
      timestamp: '2026-04-07T14:30:00Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validación fallida',
    example: {
      success: false,
      error: {
        code: 'INVALID_DATA',
        message: 'Datos incompletos o inválidos',
        details: { field: 'email', reason: 'Formato de email inválido' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado - Token inválido o expirado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Solo admins pueden crear restaurantes',
  })
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.restaurantsService.create(createRestaurantDto, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar restaurantes',
    description: 'Obtener lista de restaurantes con búsqueda, filtrado y paginación',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Máximo registros por página',
    required: false,
    example: 20,
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    description: 'Número de registros a saltar',
    required: false,
    example: 0,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    description: 'Buscar por nombre o descripción',
    required: false,
    example: 'mexicana',
  })
  @ApiQuery({
    name: 'cuisineType',
    type: String,
    description: 'Filtrar por tipo de cocina',
    required: false,
    example: 'Mexican',
  })
  @ApiQuery({
    name: 'sortBy',
    enum: ['name', 'rating', 'createdAt'],
    description: 'Campo para ordenar resultados',
    required: false,
    example: 'rating',
  })
  @ApiQuery({
    name: 'sortOrder',
    enum: ['asc', 'desc'],
    description: 'Orden ascendente o descendente',
    required: false,
    example: 'desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de restaurantes obtenida exitosamente',
    type: RestaurantResponseDto,
    isArray: true,
    example: {
      success: true,
      data: [
        {
          id: 1,
          name: 'La Esquina',
          cuisineType: 'Mexican',
          rating: 4.5,
          isActive: true,
        },
      ],
      pagination: {
        limit: 20,
        offset: 0,
        total: 150,
        pages: 8,
      },
      timestamp: '2026-04-07T14:30:00Z',
    },
  })
  async findAll(@Query() queryDto: ListRestaurantsQueryDto) {
    return this.restaurantsService.findAll(queryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener detalles de restaurante',
    description: 'Obtener información completa de un restaurante incluyendo ubicaciones, platos y reseñas',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del restaurante',
    example: 1,
  })
  @ApiQuery({
    name: 'includeLocations',
    type: Boolean,
    description: 'Incluir ubicaciones',
    required: false,
    example: true,
  })
  @ApiQuery({
    name: 'includeDishes',
    type: Boolean,
    description: 'Incluir platos',
    required: false,
    example: true,
  })
  @ApiQuery({
    name: 'includeReviews',
    type: Boolean,
    description: 'Incluir reseñas',
    required: false,
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurante encontrado',
    type: RestaurantResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurante no encontrado',
    example: {
      success: false,
      error: {
        code: 'RESTAURANT_NOT_FOUND',
        message: 'El restaurante solicitado no existe',
        details: { resourceId: 999, resourceType: 'restaurant' },
      },
    },
  })
  async findOne(@Param('id') id: number) {
    return this.restaurantsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(OwnerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar restaurante',
    description: 'Solo el propietario puede actualizar su restaurante',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del restaurante',
    example: 1,
  })
  @ApiBody({
    type: UpdateRestaurantDto,
    description: 'Campos a actualizar (parcial)',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurante actualizado',
    type: RestaurantResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'No autorizado - No eres propietario',
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurante no encontrado',
  })
  async update(
    @Param('id') id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto, user.id);
  }

  @Delete(':id')
  @UseGuards(OwnerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar restaurante',
    description: 'Soft delete - marca como eliminado pero preserva datos históricos',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del restaurante a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurante eliminado exitosamente',
    example: {
      success: true,
      message: 'Restaurante eliminado exitosamente',
      timestamp: '2026-04-07T14:30:00Z',
    },
  })
  @ApiResponse({
    status: 403,
    description: 'No autorizado - No eres propietario',
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurante no encontrado',
  })
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: UserContext,
  ) {
    return this.restaurantsService.remove(id, user.id);
  }
}
```

---

### DTOs con Decoradores Swagger

```typescript
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({
    type: String,
    description: 'Nombre del restaurante',
    example: 'La Esquina',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Descripción del establecimiento',
    example: 'Restaurante de comida mexicana tradicional',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: String,
    description: 'Tipo de cocina',
    example: 'Mexican',
  })
  @IsString()
  cuisineType: string;

  @ApiProperty({
    type: String,
    description: 'Email del restaurante',
    format: 'email',
    example: 'info@laesquina.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Teléfono de contacto',
    example: '+5215512345678',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Sitio web',
    format: 'url',
    example: 'https://laesquina.com',
  })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'URL del logo',
    format: 'url',
    example: 'https://cdn.example.com/logos/laesquina.jpg',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}

export class RestaurantResponseDto {
  @ApiProperty({
    type: Number,
    description: 'ID único del restaurante',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Nombre del restaurante',
    example: 'La Esquina',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Descripción',
    example: 'Restaurante de comida mexicana tradicional',
  })
  description: string;

  @ApiProperty({
    type: String,
    description: 'Tipo de cocina',
    example: 'Mexican',
  })
  cuisineType: string;

  @ApiProperty({
    type: Number,
    description: 'ID del propietario',
    example: 5,
  })
  ownerId: number;

  @ApiProperty({
    type: String,
    description: 'Email',
    format: 'email',
    example: 'info@laesquina.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Teléfono',
    example: '+5215512345678',
  })
  phone: string;

  @ApiProperty({
    type: Number,
    description: 'Rating promedio (0-5)',
    example: 4.5,
    minimum: 0,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({
    type: Boolean,
    description: 'Estado del restaurante',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    type: Date,
    description: 'Fecha de creación',
    example: '2026-04-07T14:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Última actualización',
    example: '2026-04-07T14:30:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    type: Array,
    description: 'Ubicaciones del restaurante',
  })
  locations?: any[];

  @ApiPropertyOptional({
    type: Array,
    description: 'Platos disponibles',
  })
  dishes?: any[];
}
```

---

### Controlador de Autenticación con Swagger

```typescript
import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description:
      'Crear una cuenta de usuario. La contraseña debe tener mínimo 8 caracteres, ' +
      '1 mayúscula, 1 número y 1 carácter especial.',
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      customer: {
        summary: 'Cliente',
        value: {
          email: 'customer@example.com',
          password: 'SecurePass123!',
          firstName: 'Juan',
          lastName: 'Pérez',
          phone: '+5215512345678',
          role: 'customer',
        },
      },
      staff: {
        summary: 'Personal',
        value: {
          email: 'staff@example.com',
          password: 'AdminPass123!',
          firstName: 'Carlos',
          lastName: 'García',
          role: 'staff',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto,
    example: {
      success: true,
      data: {
        id: 1,
        email: 'customer@example.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'customer',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expiresIn: 3600,
      },
      timestamp: '2026-04-07T14:30:00Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email ya existe o contraseña inválida',
    example: {
      success: false,
      error: {
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Este email ya está registrado',
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autenticarse con email y contraseña',
  })
  @ApiBody({
    type: LoginDto,
    example: {
      email: 'customer@example.com',
      password: 'SecurePass123!',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Autenticación exitosa',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
    example: {
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Email o contraseña incorrectos',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar token JWT',
    description: 'Obtener un nuevo token usando el refresh token',
  })
  @ApiBody({
    type: RefreshTokenDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Token renovado',
    example: {
      success: true,
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expiresIn: 3600,
      },
      timestamp: '2026-04-07T14:30:00Z',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
```

---

### Controlador de Órdenes (Complejo)

```typescript
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Orders')
@ApiBearerAuth('jwt')
@Controller('orders')
@UseGuards(JwtGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nueva orden',
    description:
      'Crear una orden con múltiples ítems. Se calcula automáticamente el total, ' +
      'impuestos (IVA 16%) y se aplica descuento si el código es válido.',
  })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      dinein: {
        summary: 'Orden para comer en el lugar',
        value: {
          restaurantId: 1,
          locationId: 1,
          orderType: 'dine-in',
          items: [
            {
              dishId: 1,
              quantity: 2,
              specialInstructions: 'Sin cebolla',
            },
            {
              dishId: 5,
              quantity: 1,
            },
          ],
          discountCode: 'WELCOME20',
          specialRequests: 'Mesa junto a la ventana',
        },
      },
      delivery: {
        summary: 'Orden para entregar',
        value: {
          restaurantId: 2,
          locationId: 3,
          orderType: 'delivery',
          items: [
            {
              dishId: 10,
              quantity: 1,
              specialInstructions: 'Extra picante',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Orden creada exitosamente',
    type: OrderResponseDto,
    example: {
      success: true,
      data: {
        id: 1,
        orderNumber: 'ORD-2026-0001',
        restaurantId: 1,
        restaurantName: 'La Esquina',
        totalAmount: 27.97,
        discountAmount: 0.0,
        taxAmount: 2.24,
        status: 'pending',
        orderType: 'dine-in',
        items: [
          {
            dishId: 1,
            dishName: 'Tacos al Pastor',
            quantity: 2,
            unitPrice: 5.99,
            subtotal: 11.98,
          },
        ],
        createdAt: '2026-04-07T14:30:00Z',
      },
      timestamp: '2026-04-07T14:30:00Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validación fallida - Platos no disponibles o datos inválidos',
    example: {
      success: false,
      error: {
        code: 'DISH_UNAVAILABLE',
        message: 'Algunos platos no están disponibles',
        details: { dishIds: [5] },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurante o ubicación no encontrados',
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.ordersService.create(createOrderDto, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar órdenes del usuario',
    description: 'Obtener todas las órdenes del usuario autenticado con filtros y paginación',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Máximo de registros',
    required: false,
    example: 20,
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    description: 'Saltar registros',
    required: false,
    example: 0,
  })
  @ApiQuery({
    name: 'status',
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    description: 'Filtrar por estado',
    required: false,
  })
  @ApiQuery({
    name: 'restaurantId',
    type: Number,
    description: 'Filtrar por restaurante',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes',
    type: OrderResponseDto,
    isArray: true,
  })
  async findAll(
    @Query() queryDto: any,
    @CurrentUser() user: UserContext,
  ) {
    return this.ordersService.findAll(queryDto, user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener detalles de orden',
    description: 'Obtener información completa de una orden incluyendo todos sus ítems',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la orden',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Orden encontrada',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  async findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('staff', 'admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar estado de orden',
    description:
      'Cambiar el estado de la orden. Solo staff y admin. Transiciones válidas: ' +
      'pending→confirmed→preparing→ready→delivered. Cualquier estado→cancelled',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la orden',
    example: 1,
  })
  @ApiBody({
    type: UpdateOrderStatusDto,
    examples: {
      confirm: {
        summary: 'Confirmar orden',
        value: { status: 'confirmed' },
      },
      cancel: {
        summary: 'Cancelar orden',
        value: { status: 'cancelled' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado',
  })
  @ApiResponse({
    status: 400,
    description: 'Transición de estado no válida',
    example: {
      success: false,
      error: {
        code: 'INVALID_STATUS_TRANSITION',
        message: 'No puede transicionar de delivered a pending',
        details: { from: 'delivered', to: 'pending' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Solo staff y admin pueden cambiar estado',
  })
  async updateStatus(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancelar orden',
    description:
      'Cancelar una orden e iniciar proceso de reembolso. ' +
      'Solo permitido si no está entregada o cancelada.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la orden',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string', example: 'Cambié de opinión' },
        refundMethod: { enum: ['original_payment', 'credit'], example: 'original_payment' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Orden cancelada',
    example: {
      success: true,
      message: 'Orden cancelada exitosamente',
      data: {
        refundAmount: 27.97,
        refundMethod: 'original_payment',
        status: 'cancelled',
      },
      timestamp: '2026-04-07T14:30:00Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Orden no puede cancelarse',
  })
  async remove(
    @Param('id') id: number,
    @Body() body: any,
    @CurrentUser() user: UserContext,
  ) {
    return this.ordersService.cancel(id, body, user.id);
  }
}
```

---

### Instalación y Configuración

**package.json dependencies**:
```json
{
  "dependencies": {
    "@nestjs/swagger": "^7.0.0",
    "swagger-ui-express": "^5.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0"
  },
  "devDependencies": {
    "@types/swagger-ui-express": "^4.1.3"
  }
}
```

**Comando de instalación**:
```bash
npm install @nestjs/swagger swagger-ui-express class-transformer class-validator
```

---

## ORM: Prisma 5.x

### Schema Prisma

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Usuarios
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  firstName     String
  lastName      String
  phone         String?
  address       String?
  role          UserRole  @default(CUSTOMER)
  avatar        String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  // Relaciones
  orders        Order[]
  reviews       Review[]
  reservations  Reservation[]
  staffAssignment StaffAssignment?

  @@index([email])
  @@index([role])
}

enum UserRole {
  ADMIN
  STAFF
  CUSTOMER
}

// Restaurantes
model Restaurant {
  id            String    @id @default(cuid())
  name          String    @unique
  description   String?
  phone         String
  email         String
  logo          String?
  rating        Float     @default(0)
  averagePrice  Float?
  isOpen        Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  // Relaciones
  locations     Location[]
  categories    Category[]
  dishes        Dish[]
  tables        Table[]
  orders        Order[]
  reviews       Review[]
  staff         StaffAssignment[]

  @@index([name])
}

// Ubicaciones
model Location {
  id            String    @id @default(cuid())
  address       String
  city          String
  state         String
  zipCode       String
  latitude      Float
  longitude     Float
  isOpen        Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  restaurantId  String
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)

  // Relaciones
  tables        Table[]
  orders        Order[]

  @@index([restaurantId])
  @@index([city])
}

// Categorías
model Category {
  id            String    @id @default(cuid())
  name          String
  description   String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  restaurantId  String
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)

  // Relaciones
  dishes        Dish[]

  @@unique([restaurantId, name])
  @@index([restaurantId])
}

// Platos
model Dish {
  id            String    @id @default(cuid())
  name          String
  description   String?
  price         Float
  image         String?
  isAvailable   Boolean   @default(true)
  preparationTime Int?    // En minutos
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  restaurantId  String
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)

  categoryId    String
  category      Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  // Relaciones
  orderItems    OrderItem[]

  @@index([restaurantId])
  @@index([categoryId])
}

// Mesas
model Table {
  id            String    @id @default(cuid())
  tableNumber   Int
  seatsCapacity Int
  status        TableStatus @default(AVAILABLE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  restaurantId  String
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)

  locationId    String
  location      Location @relation(fields: [locationId], references: [id], onDelete: Cascade)

  // Relaciones
  reservations  Reservation[]
  orders        Order[]

  @@unique([locationId, tableNumber])
  @@index([restaurantId])
  @@index([locationId])
}

enum TableStatus {
  AVAILABLE
  OCCUPIED
  RESERVED
  MAINTENANCE
}

// Órdenes
model Order {
  id            String    @id @default(cuid())
  orderNumber   String    @unique
  status        OrderStatus @default(PENDING)
  type          OrderType @default(DINE_IN)
  totalPrice    Float
  specialNotes  String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  userId        String
  user          User @relation(fields: [userId], references: [id], onDelete: Restrict)

  restaurantId  String
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Restrict)

  locationId    String
  location      Location @relation(fields: [locationId], references: [id], onDelete: Restrict)

  tableId       String?
  table         Table? @relation(fields: [tableId], references: [id], onDelete: SetNull)

  // Relaciones
  items         OrderItem[]

  @@index([userId])
  @@index([restaurantId])
  @@index([status])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  READY
  DELIVERED
  CANCELLED
}

enum OrderType {
  DINE_IN
  DELIVERY
  TAKEAWAY
}

// Items de Orden
model OrderItem {
  id            String    @id @default(cuid())
  quantity      Int
  unitPrice     Float
  subtotal      Float
  specialRequests String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  orderId       String
  order         Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  dishId        String
  dish          Dish @relation(fields: [dishId], references: [id], onDelete: Restrict)

  @@index([orderId])
  @@index([dishId])
}

// Reseñas
model Review {
  id            String    @id @default(cuid())
  rating        Int       // 1-5
  comment       String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  userId        String
  user          User @relation(fields: [userId], references: [id], onDelete: Cascade)

  restaurantId  String
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)

  @@unique([userId, restaurantId])
  @@index([restaurantId])
}

// Reservas
model Reservation {
  id            String    @id @default(cuid())
  reservationDate DateTime
  guestCount    Int
  status        ReservationStatus @default(PENDING)
  specialRequests String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  userId        String
  user          User @relation(fields: [userId], references: [id], onDelete: Cascade)

  tableId       String
  table         Table @relation(fields: [tableId], references: [id], onDelete: Restrict)

  @@index([userId])
  @@index([tableId])
  @@index([status])
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}

// Personal del Restaurante
model StaffAssignment {
  id            String    @id @default(cuid())
  position      String
  salary        Float
  contractType  String
  hireDate      DateTime
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  userId        String    @unique
  user          User @relation(fields: [userId], references: [id], onDelete: Cascade)

  restaurantId  String
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)

  @@index([restaurantId])
}
```

### Prisma Service

```typescript
// src/database/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Método auxiliar para transacciones
  async transaction<T>(callback: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(async (tx) => {
      return callback(tx as PrismaClient);
    });
  }
}
```

### Database Module

```typescript
// src/database/database.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
```

### Repository Pattern con Prisma

```typescript
// src/restaurants/restaurants.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateRestaurantData } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRestaurantData) {
    return this.prisma.restaurant.create({
      data,
      include: {
        categories: true,
        locations: true,
      },
    });
  }

  async findAll(filters: { search?: string; skip?: number; take?: number }) {
    return this.prisma.restaurant.findMany({
      where: filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { description: { contains: filters.search, mode: 'insensitive' } },
            ],
          }
        : {},
      skip: filters.skip || 0,
      take: filters.take || 10,
      include: {
        locations: true,
        _count: { select: { reviews: true } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        categories: true,
        locations: true,
        tables: true,
      },
    });
  }

  async update(id: string, data: Partial<CreateRestaurantData>) {
    return this.prisma.restaurant.update({
      where: { id },
      data,
      include: { locations: true, categories: true },
    });
  }

  async remove(id: string) {
    return this.prisma.restaurant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
```

### Configuración en App Module

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { OrdersModule } from './orders/orders.module';
// ... otros módulos

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule, // Primero el database module
    RestaurantsModule,
    OrdersModule,
    // ... otros módulos
  ],
})
export class AppModule {}
```

### npm scripts para Prisma

Agregar en `package.json`:

```json
"scripts": {
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:migrate:prod": "prisma migrate deploy",
  "prisma:seed": "ts-node prisma/seed.ts",
  "prisma:studio": "prisma studio",
  "db:reset": "prisma migrate reset --skip-generate",
  "start": "nest start",
  "dev": "nest start --watch"
}
```

---

## Testing: Jest + Supertest

### Configuración Jest

```javascript
// jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>', '<rootDir>/../test'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
};
```

### Configuración Jest E2E

```javascript
// jest-e2e.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'test',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
```

### Unit Test - Restaurants Service

```typescript
// __tests__/restaurants/restaurants.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { RestaurantsRepository } from 'src/restaurants/restaurants.repository';

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let repository: RestaurantsRepository;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: RestaurantsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    repository = module.get<RestaurantsRepository>(RestaurantsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return list of restaurants', async () => {
      const restaurants = [
        { id: '1', name: 'Restaurant 1' },
        { id: '2', name: 'Restaurant 2' },
      ];

      mockRepository.findAll.mockResolvedValue(restaurants);

      const result = await service.findAll({ limit: 10, offset: 0 });

      expect(result).toEqual(restaurants);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });

    it('should apply search filter', async () => {
      const restaurants = [{ id: '1', name: 'Pizzeria' }];

      mockRepository.findAll.mockResolvedValue(restaurants);

      await service.findAll({ limit: 10, offset: 0, search: 'Pizza' });

      expect(mockRepository.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        search: 'Pizza',
      });
    });
  });

  describe('create', () => {
    it('should create a restaurant', async () => {
      const createDto = {
        name: 'New Restaurant',
        email: 'rest@email.com',
        phone: '123456789',
      };

      const expectedResult = { id: '1', ...createDto };

      mockRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findById', () => {
    it('should return a restaurant by id', async () => {
      const restaurant = { id: '1', name: 'Restaurant 1' };

      mockRepository.findById.mockResolvedValue(restaurant);

      const result = await service.findById('1');

      expect(result).toEqual(restaurant);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when restaurant not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(
        'Restaurant not found',
      );
    });
  });
});
```

### E2E Test - Restaurants Controller

```typescript
// test/restaurants.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('Restaurants (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Login para obtener token
    const loginResponse = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'admin@email.com',
        password: 'password123',
      });

    authToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/restaurants', () => {
    it('should create a restaurant', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Restaurant',
          email: 'test@restaurant.com',
          phone: '+51912345678',
          description: 'A great restaurant',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Test Restaurant');
          expect(res.body.email).toBe('test@restaurant.com');
        });
    });

    it('should return 400 when name is missing', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'test@restaurant.com',
          phone: '+51912345678',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name should not be empty');
        });
    });

    it('should return 409 when name already exists', () => {
      return request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Existing Restaurant',
          email: 'unique@email.com',
          phone: '+51912345678',
        })
        .expect(409)
        .expect((res) => {
          expect(res.body.error).toBe('DUPLICATE_RESTAURANT_NAME');
        });
    });
  });

  describe('GET /v1/restaurants', () => {
    it('should return list of restaurants', () => {
      return request(app.getHttpServer())
        .get('/v1/restaurants')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body).toHaveProperty('pagination');
          expect(res.body.pagination).toHaveProperty('total');
          expect(res.body.pagination).toHaveProperty('limit');
          expect(res.body.pagination).toHaveProperty('offset');
        });
    });

    it('should filter restaurants by search', () => {
      return request(app.getHttpServer())
        .get('/v1/restaurants?search=pizza')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should handle pagination', () => {
      return request(app.getHttpServer())
        .get('/v1/restaurants?limit=5&offset=0')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeLessThanOrEqual(5);
          expect(res.body.pagination.limit).toBe(5);
        });
    });
  });

  describe('GET /v1/restaurants/:id', () => {
    let restaurantId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/restaurants')
        .expect(200);

      restaurantId = res.body.data[0].id;
    });

    it('should return a restaurant', () => {
      return request(app.getHttpServer())
        .get(`/v1/restaurants/${restaurantId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', restaurantId);
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('email');
        });
    });

    it('should return 404 for non-existent restaurant', () => {
      return request(app.getHttpServer())
        .get('/v1/restaurants/non-existent-id')
        .expect(404)
        .expect((res) => {
          expect(res.body.error).toBe('RESTAURANT_NOT_FOUND');
        });
    });
  });

  describe('PUT /v1/restaurants/:id', () => {
    let restaurantId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/restaurants')
        .expect(200);

      restaurantId = res.body.data[0].id;
    });

    it('should update a restaurant', () => {
      return request(app.getHttpServer())
        .put(`/v1/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Updated description',
          phone: '+51998765432',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.description).toBe('Updated description');
          expect(res.body.phone).toBe('+51998765432');
        });
    });

    it('should return 403 when not authorized', () => {
      return request(app.getHttpServer())
        .put(`/v1/restaurants/${restaurantId}`)
        .send({
          description: 'Trying to update without auth',
        })
        .expect(403);
    });
  });

  describe('DELETE /v1/restaurants/:id', () => {
    let restaurantId: string;

    beforeAll(async () => {
      // Crear un restaurante para eliminar
      const res = await request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Restaurant to Delete',
          email: 'todelete@restaurant.com',
          phone: '+51912345678',
        })
        .expect(201);

      restaurantId = res.body.id;
    });

    it('should soft delete a restaurant', () => {
      return request(app.getHttpServer())
        .delete(`/v1/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Restaurant deleted successfully');
        });
    });

    it('should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/v1/restaurants/${restaurantId}`)
        .expect(404);
    });
  });
});
```

### Testing Dependencies en package.json

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

### npm test scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./jest-e2e.config.js"
  }
}
```

---

## Middleware y Guardias

### JWT Guard

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
```

**Uso:**
```typescript
@UseGuards(JwtGuard)
@Get('/protected')
getProtected() { }
```

---

### Roles Guard

```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Permisos insuficientes');
    }

    return true;
  }
}
```

**Uso:**
```typescript
@UseGuards(RolesGuard)
@Roles(['admin'])
@Post()
createRestaurant() { }
```

---

### Owner Guard

Verificar que el usuario es propietario del recurso.

```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private restaurantsService: RestaurantsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const restaurantId = request.params.id;
    const userId = request.user.id;

    const restaurant = await this.restaurantsService.findOne(restaurantId);
    if (restaurant.ownerId !== userId) {
      throw new ForbiddenException('No eres propietario de este restaurante');
    }

    return true;
  }
}
```

---

### Request Logger Middleware

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.path}`);
    next();
  }
}
```

---

## Inyección de Dependencias

### Módulo con Providers

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsRepository } from './restaurants.repository';
import { RestaurantSearchService } from './services/restaurant-search.service';
import { RestaurantAnalyticsService } from './services/restaurant-analytics.service';
import { Restaurant } from './entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  controllers: [RestaurantsController],
  providers: [
    RestaurantsService,
    RestaurantsRepository,
    RestaurantSearchService,
    RestaurantAnalyticsService,
  ],
  exports: [RestaurantsService, RestaurantsRepository],
})
export class RestaurantsModule {}
```

### Service con Inyección

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsRepository } from './restaurants.repository';
import { RestaurantSearchService } from './services/restaurant-search.service';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private repository: Repository<Restaurant>,
    private customRepository: RestaurantsRepository,
    private searchService: RestaurantSearchService,
  ) {}

  async findAll(queryDto: ListRestaurantsQueryDto) {
    if (queryDto.search) {
      return this.searchService.search(queryDto.search, queryDto);
    }
    return this.customRepository.findWithPagination(queryDto);
  }
}
```

---

## Flujos de Datos

### Flujo 1: Crear Orden

```
POST /orders {items, restaurantId...}
    ↓
  OrdersController.create()
    ↓
  ValidationPipe (valida CreateOrderDto)
    ↓
  JwtGuard (autentica usuario)
    ↓
  OrdersService.create()
    - Validar restaurante existe
    - Validar platos disponibles
    - Validar descuento válido
    - Crear Order + OrderItems
    - Calcular total + tax
    ↓
  OrdersRepository.saveWithItems()
    - Transacción DB
    ↓
  TransformInterceptor
    - Formatea respuesta
    - Añade status, timestamp
    ↓
  Response 201
```

---

### Flujo 2: Cambiar Estado de Orden

```
PUT /orders/:id {status: 'confirmed'}
    ↓
  OrdersController.updateStatus()
    ↓
  JwtGuard
    ↓
  RolesGuard (solo staff/admin)
    ↓
  OrdersService.updateStatus()
    - Validar transición válida:
      pending → confirmed ✓
      confirmed → preparing ✓
      preparing → ready ✓
      ready → delivered ✓
      * → cancelled ✓
    - Cualquier otra → ERROR
    - Actualizar estado
    - Si delivered: trigger cálculo rating
    - Si cancelled: procesar reembolso
    ↓
  OrdersRepository.update()
    ↓
  EventEmitter (emite OrderStatusChanged)
    - Queue.emit('sendEmailJob', {...})
    ↓
  Response 200
```

---

### Flujo 3: Crear Reserva

```
POST /restaurants/:id/reservations {date, time, guestCount...}
    ↓
  ReservationsController.create()
    ↓
  ValidationPipe
    ↓
  JwtGuard (autenticado)
    ↓
  ReservationsService.create()
    - Validar restaurante existe
    - Llamar TableAvailabilityService
      → SELECT * FROM tables WHERE
          location_id = ?
          AND capacity >= guestCount
      → Validar no hay conflictos:
          SELECT * FROM reservations WHERE
          reservation_date = ?
          AND reservation_time = ? (±30min)
          AND status = 'confirmed'
    - Si hay mesa disponible: continuar
    - Si no: throw 409 TABLE_NOT_AVAILABLE
    - Crear reserva con status 'confirmed'
    - Scheduler para expirar en 1 hora (soft delete)
    ↓
  ReservationsRepository.save()
    ↓
  Queue.emit('sendEmailJob')
    - Enviar confirmación
    ↓
  Response 201
```

---

## Configuración Global

### app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { DatabaseModule } from './database/database.module';
import { ConfigService as AppConfigService } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: ['src/**/*.entity.ts'],
        synchronize: false,
        migrations: ['src/database/migrations/*.ts'],
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    // ... más módulos
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## Resumen de Responsabilidades

| Componente | Responsabilidad |
|-----------|-----------------|
| **Controller** | Recibir HTTP request, validar guards, delegar a service |
| **Service** | Lógica de negocio, orquestación, reglas de validación |
| **Repository** | Queries a BD, transacciones, datos complejos |
| **Entity** | Schema de tabla, relaciones, constraints |
| **DTO** | Validación de entrada, transformación de tipos |
| **Guard** | Autenticación, autorización, verificar permisos |
| **Middleware** | Logging, timing, CORS |
| **Interceptor** | Transformar respuestas, manejo de errores global |
| **Exception Filter** | Formatear excepciones a respuestas JSON |
| **Decorator** | Metadatos personalizados (@Roles, @CurrentUser) |

---

## Próximos Pasos de Implementación

1. **Crear estructura base** — Scaffold de módulos y controladores
2. **Implementar Auth** — JWT, registro, login
3. **Implementar Users** — CRUD de usuarios
4. **Implementar Restaurants** — CRUD y búsqueda
5. **Implementar Orders** — El más complejo (transacciones, pagos)
6. **Implementar Reservations** — Validación de disponibilidad
7. **Implementar Reviews** — Cálculo de ratings
8. **Migraciones BD** — Scripts de creación de tablas
9. **Tests** — Unit tests de servicios, E2E de controladores
10. **Deployment** — Docker, CI/CD

---

**Documento generado**: 7 de abril de 2026  
**Versión**: 1.0  
**Status**: Listo para implementación
