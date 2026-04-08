# Contratos REST API - Dominio Restaurantes

**Versión**: 1.0  
**Última actualización**: 7 de abril de 2026  
**Base URL**: `https://api.restaurants.local/v1`  
**Autenticación**: JWT Bearer Token  
**Content-Type**: `application/json`

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Users](#users)
4. [Restaurants](#restaurants)
5. [Locations](#locations)
6. [Dishes](#dishes)
7. [Orders](#orders)
8. [Reservations](#reservations)
9. [Reviews](#reviews)
10. [Staff Management](#staff-management)
11. [Códigos de Error](#códigos-de-error)

---

## Introducción

### Convenciones

- **Status Codes**: RESTful estándar (200, 201, 400, 401, 403, 404, 409, 500)
- **Timestamps**: ISO 8601 UTC (`2026-04-07T14:30:00Z`)
- **Paginación**: `limit`, `offset`, `total` en respuestas
- **Errores**: Formato estándar JSON con código de error
- **Validación**: Campos requeridos indicados con `*`

### Estructura de Respuesta de Error

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "El restaurante solicitado no existe",
    "details": {
      "resourceId": 123,
      "resourceType": "restaurant"
    }
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

### Estructura de Respuesta Exitosa

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

## Autenticación

### POST `/auth/register`

Registrar nuevo usuario.

**Request Body:**
```json
{
  "email*": "user@example.com",
  "password*": "SecurePass123!",
  "firstName*": "Juan",
  "lastName*": "Pérez",
  "phone": "+5215512345678",
  "role": "customer"
}
```

**Parámetros:**
- `email` (string): Unique email del usuario
- `password` (string): Mínimo 8 caracteres, 1 mayúscula, 1 número, 1 especial
- `firstName` (string): Nombre del usuario
- `lastName` (string): Apellido del usuario
- `phone` (string): Número de teléfono (opcional)
- `role` (enum): `customer`, `staff`, `admin` (default: `customer`)

**Response 201 - Created:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+5215512345678",
    "role": "customer",
    "avatarUrl": null,
    "createdAt": "2026-04-07T14:30:00Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `EMAIL_ALREADY_EXISTS` | 409 | Email ya registrado |
| `INVALID_PASSWORD` | 400 | Contraseña no cumple requisitos |
| `INVALID_EMAIL` | 400 | Formato de email inválido |

---

### POST `/auth/login`

Autenticación de usuario.

**Request Body:**
```json
{
  "email*": "user@example.com",
  "password*": "SecurePass123!"
}
```

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "customer",
    "avatarUrl": null,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email o contraseña incorrectos |
| `USER_NOT_FOUND` | 404 | Usuario no existe |
| `ACCOUNT_INACTIVE` | 403 | Cuenta desactivada |

---

### POST `/auth/refresh-token`

Renovar token JWT.

**Request Body:**
```json
{
  "refreshToken*": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### GET `/auth/me`

Obtener perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+5215512345678",
    "role": "customer",
    "avatarUrl": "https://cdn.example.com/avatars/user-1.jpg",
    "createdAt": "2026-04-07T14:30:00Z",
    "updatedAt": "2026-04-07T14:30:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `UNAUTHORIZED` | 401 | Token inválido o expirado |
| `TOKEN_EXPIRED` | 401 | Token vencido |

---

## Users

### GET `/users/:id`

Obtener información de un usuario.

**Path Parameters:**
- `id` (number): ID del usuario

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+5215512345678",
    "role": "customer",
    "avatarUrl": "https://cdn.example.com/avatars/user-1.jpg",
    "createdAt": "2026-04-07T14:30:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `USER_NOT_FOUND` | 404 | Usuario no existe |

---

### PUT `/users/:id`

Actualizar perfil de usuario.

**Path Parameters:**
- `id` (number): ID del usuario

**Request Body:**
```json
{
  "firstName": "Carlos",
  "lastName": "García",
  "phone": "+5215512345678",
  "avatarUrl": "https://cdn.example.com/avatars/user-1.jpg"
}
```

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Carlos",
    "lastName": "García",
    "phone": "+5215512345678",
    "role": "customer",
    "avatarUrl": "https://cdn.example.com/avatars/user-1.jpg",
    "updatedAt": "2026-04-07T14:30:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `USER_NOT_FOUND` | 404 | Usuario no existe |
| `FORBIDDEN` | 403 | No autorizado para editar este usuario |

---

### PUT `/users/:id/password`

Cambiar contraseña.

**Request Body:**
```json
{
  "currentPassword*": "OldPass123!",
  "newPassword*": "NewPass123!"
}
```

**Response 200 - OK:**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente",
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `INVALID_PASSWORD` | 400 | Contraseña actual incorrecta |
| `WEAK_PASSWORD` | 400 | Nueva contraseña no cumple requisitos |

---

## Restaurants

### POST `/restaurants`

Crear nuevo restaurante.

**Headers:**
```
Authorization: Bearer {token}
X-Role: admin|staff
```

**Request Body:**
```json
{
  "name*": "La Esquina",
  "description": "Restaurante de comida mexicana tradicional",
  "cuisineType*": "Mexican",
  "phone*": "+5215512345678",
  "email*": "info@laesquina.com",
  "websiteUrl": "https://laesquina.com",
  "logoUrl": "https://cdn.example.com/logos/laesquina.jpg"
}
```

**Response 201 - Created:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "La Esquina",
    "description": "Restaurante de comida mexicana tradicional",
    "cuisineType": "Mexican",
    "ownerId": 5,
    "phone": "+5215512345678",
    "email": "info@laesquina.com",
    "websiteUrl": "https://laesquina.com",
    "logoUrl": "https://cdn.example.com/logos/laesquina.jpg",
    "rating": 0.00,
    "isActive": true,
    "createdAt": "2026-04-07T14:30:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `UNAUTHORIZED` | 401 | Token requerido |
| `FORBIDDEN` | 403 | Solo admins pueden crear restaurantes |
| `INVALID_DATA` | 400 | Datos incompletos o inválidos |

---

### GET `/restaurants`

Listar restaurantes.

**Query Parameters:**
- `limit` (number): Máximo de registros (default: 20, max: 100)
- `offset` (number): Saltar N registros (default: 0)
- `search` (string): Buscar por nombre o descripción
- `cuisineType` (string): Filtrar por tipo de cocina
- `isActive` (boolean): Mostrar solo activos (default: true)
- `sortBy` (enum): `name`, `rating`, `createdAt` (default: `name`)
- `sortOrder` (enum): `asc`, `desc` (default: `asc`)

**URL Ejemplo:**
```
GET /restaurants?limit=20&offset=0&search=mexicana&sort By=rating&sortOrder=desc
```

**Response 200 - OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "La Esquina",
      "description": "Restaurante de comida mexicana...",
      "cuisineType": "Mexican",
      "phone": "+5215512345678",
      "email": "info@laesquina.com",
      "logoUrl": "https://cdn.example.com/logos/laesquina.jpg",
      "rating": 4.5,
      "isActive": true,
      "createdAt": "2026-04-07T14:30:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 150,
    "pages": 8
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### GET `/restaurants/:id`

Obtener detalles completos de un restaurante.

**Path Parameters:**
- `id` (number): ID del restaurante

**Query Parameters:**
- `includeLocations` (boolean): Incluir ubicaciones (default: true)
- `includeDishes` (boolean): Incluir platos (default: true)
- `includeReviews` (boolean): Incluir reseñas (default: false)

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "La Esquina",
    "description": "Restaurante de comida mexicana tradicional",
    "cuisineType": "Mexican",
    "ownerId": 5,
    "phone": "+5215512345678",
    "email": "info@laesquina.com",
    "websiteUrl": "https://laesquina.com",
    "logoUrl": "https://cdn.example.com/logos/laesquina.jpg",
    "rating": 4.5,
    "isActive": true,
    "locations": [
      {
        "id": 1,
        "address": "Calle Principal 123",
        "city": "CDMX",
        "state": "Ciudad de México",
        "postalCode": "06500",
        "latitude": 19.4326,
        "longitude": -99.1332,
        "openingTime": "11:00",
        "closingTime": "23:00",
        "isPrimary": true
      }
    ],
    "dishes": [
      {
        "id": 1,
        "name": "Tacos al Pastor",
        "price": 5.99,
        "categoryId": 1
      }
    ],
    "createdAt": "2026-04-07T14:30:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `RESTAURANT_NOT_FOUND` | 404 | Restaurante no existe |

---

### PUT `/restaurants/:id`

Actualizar restaurante.

**Path Parameters:**
- `id` (number): ID del restaurante

**Request Body:**
```json
{
  "name": "La Esquina Tradicional",
  "description": "Actualizado",
  "cuisineType": "Mexican",
  "phone": "+5215512345678",
  "email": "info@laesquina.com",
  "isActive": true
}
```

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "La Esquina Tradicional",
    "description": "Actualizado",
    "updatedAt": "2026-04-07T14:35:00Z"
  },
  "timestamp": "2026-04-07T14:35:00Z"
}
```

---

### DELETE `/restaurants/:id`

Eliminar restaurante (soft delete).

**Path Parameters:**
- `id` (number): ID del restaurante

**Response 200 - OK:**
```json
{
  "success": true,
  "message": "Restaurante eliminado exitosamente",
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

## Locations

### POST `/restaurants/:restaurantId/locations`

Crear ubicación para restaurante.

**Request Body:**
```json
{
  "address*": "Calle Principal 123",
  "city*": "CDMX",
  "state": "Ciudad de México",
  "postalCode": "06500",
  "country": "Mexico",
  "latitude*": 19.4326,
  "longitude*": -99.1332,
  "openingTime*": "11:00",
  "closingTime*": "23:00",
  "isPrimary": false
}
```

**Response 201 - Created:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "restaurantId": 1,
    "address": "Calle Principal 123",
    "city": "CDMX",
    "state": "Ciudad de México",
    "postalCode": "06500",
    "country": "Mexico",
    "latitude": 19.4326,
    "longitude": -99.1332,
    "openingTime": "11:00",
    "closingTime": "23:00",
    "isPrimary": false,
    "createdAt": "2026-04-07T14:30:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### GET `/restaurants/:restaurantId/locations`

Listar ubicaciones de restaurante.

**Response 200 - OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "restaurantId": 1,
      "address": "Calle Principal 123",
      "city": "CDMX",
      "state": "Ciudad de México",
      "postalCode": "06500",
      "latitude": 19.4326,
      "longitude": -99.1332,
      "openingTime": "11:00",
      "closingTime": "23:00",
      "isPrimary": true
    }
  ],
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### PUT `/locations/:id`

Actualizar ubicación.

**Request Body:**
```json
{
  "openingTime": "10:00",
  "closingTime": "23:30",
  "isPrimary": true
}
```

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "openingTime": "10:00",
    "closingTime": "23:30",
    "isPrimary": true,
    "updatedAt": "2026-04-07T14:35:00Z"
  },
  "timestamp": "2026-04-07T14:35:00Z"
}
```

---

### DELETE `/locations/:id`

Eliminar ubicación.

**Response 200 - OK:**
```json
{
  "success": true,
  "message": "Ubicación eliminada exitosamente",
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `ACTIVE_ORDERS_EXISTS` | 409 | No se puede eliminar ubicación con órdenes activas |

---

## Dishes

### POST `/restaurants/:restaurantId/dishes`

Crear plato.

**Request Body:**
```json
{
  "categoryId*": 1,
  "name*": "Tacos al Pastor",
  "description": "Tacos tradicionales al pastor con piña",
  "price*": 5.99,
  "imageUrl": "https://cdn.example.com/dishes/tacos-al-pastor.jpg",
  "preparationTime": 15,
  "isAvailable": true,
  "ingredients": "carne de cerdo, piña, tortilla, cebolla",
  "allergens": "gluten, lácteos"
}
```

**Response 201 - Created:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "categoryId": 1,
    "restaurantId": 1,
    "name": "Tacos al Pastor",
    "description": "Tacos tradicionales al pastor con piña",
    "price": 5.99,
    "imageUrl": "https://cdn.example.com/dishes/tacos-al-pastor.jpg",
    "preparationTime": 15,
    "isAvailable": true,
    "ingredients": "carne de cerdo, piña, tortilla, cebolla",
    "allergens": "gluten, lácteos",
    "createdAt": "2026-04-07T14:30:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### GET `/restaurants/:restaurantId/dishes`

Listar platos de restaurante.

**Query Parameters:**
- `limit` (number): Máximo registros (default: 50)
- `offset` (number): Saltar registros (default: 0)
- `categoryId` (number): Filtrar por categoría
- `isAvailable` (boolean): Solo disponibles (default: true)
- `search` (string): Buscar por nombre
- `maxPrice` (number): Filtrar por precio máximo
- `minPrice` (number): Filtrar por precio mínimo

**Response 200 - OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "categoryId": 1,
      "name": "Tacos al Pastor",
      "description": "Tacos tradicionales...",
      "price": 5.99,
      "imageUrl": "https://cdn.example.com/dishes/tacos-al-pastor.jpg",
      "preparationTime": 15,
      "isAvailable": true,
      "allergens": "gluten, lácteos"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 40,
    "pages": 1
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### GET `/dishes/:id`

Obtener detalles de plato.

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "categoryId": 1,
    "restaurantId": 1,
    "name": "Tacos al Pastor",
    "description": "Tacos tradicionales al pastor con piña",
    "price": 5.99,
    "imageUrl": "https://cdn.example.com/dishes/tacos-al-pastor.jpg",
    "preparationTime": 15,
    "isAvailable": true,
    "ingredients": "carne de cerdo, piña, tortilla, cebolla",
    "allergens": "gluten, lácteos",
    "createdAt": "2026-04-07T14:30:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### PUT `/dishes/:id`

Actualizar plato.

**Request Body:**
```json
{
  "name": "Tacos al Pastor Premium",
  "price": 6.99,
  "isAvailable": true,
  "preparationTime": 20
}
```

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Tacos al Pastor Premium",
    "price": 6.99,
    "isAvailable": true,
    "preparationTime": 20,
    "updatedAt": "2026-04-07T14:35:00Z"
  },
  "timestamp": "2026-04-07T14:35:00Z"
}
```

---

### DELETE `/dishes/:id`

Eliminar plato.

**Response 200 - OK:**
```json
{
  "success": true,
  "message": "Plato eliminado exitosamente",
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `DISH_HAS_ORDERS` | 409 | Plato tiene órdenes; no puede eliminarse |

---

## Orders

### POST `/orders`

Crear orden.

**Request Body:**
```json
{
  "restaurantId*": 1,
  "locationId*": 1,
  "orderType*": "dine-in",
  "items*": [
    {
      "dishId": 1,
      "quantity": 2,
      "specialInstructions": "Sin cebolla"
    },
    {
      "dishId": 5,
      "quantity": 1
    }
  ],
  "discountCode": "SPRING20",
  "specialRequests": "Entregar rápido"
}
```

**Parámetros:**
- `restaurantId` (number): ID del restaurante
- `locationId` (number): ID de ubicación para atención
- `orderType` (enum): `dine-in`, `takeout`, `delivery`
- `items` (array): Ítems de la orden
  - `dishId` (number): ID del plato
  - `quantity` (number): Cantidad
  - `specialInstructions` (string): Instrucciones especiales
- `discountCode` (string): Código de descuento
- `specialRequests` (string): Solicitudes especiales

**Response 201 - Created:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "restaurantId": 1,
    "locationId": 1,
    "orderNumber": "ORD-2026-0001",
    "totalAmount": 27.97,
    "discountAmount": 0.00,
    "taxAmount": 2.24,
    "status": "pending",
    "orderType": "dine-in",
    "specialRequests": "Entregar rápido",
    "items": [
      {
        "id": 1,
        "dishId": 1,
        "dishName": "Tacos al Pastor",
        "quantity": 2,
        "unitPrice": 5.99,
        "subtotal": 11.98,
        "specialInstructions": "Sin cebolla"
      },
      {
        "id": 2,
        "dishId": 5,
        "dishName": "Refresco",
        "quantity": 1,
        "unitPrice": 2.99,
        "subtotal": 2.99
      }
    ],
    "createdAt": "2026-04-07T14:30:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `INVALID_DISCOUNT` | 400 | Código de descuento inválido |
| `DISH_UNAVAILABLE` | 400 | Algunos platos no están disponibles |
| `INSUFFICIENT_INVENTORY` | 400 | Insuficiente inventario |

---

### GET `/orders`

Listar órdenes del usuario autenticado.

**Query Parameters:**
- `limit` (number): Máximo (default: 20)
- `offset` (number): Saltar (default: 0)
- `status` (enum): `pending`, `confirmed`, `preparing`, `ready`, `delivered`, `cancelled`
- `restaurantId` (number): Filtrar por restaurante
- `startDate` (string): ISO 8601 formato
- `endDate` (string): ISO 8601 formato

**Response 200 - OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-2026-0001",
      "restaurantId": 1,
      "restaurantName": "La Esquina",
      "totalAmount": 27.97,
      "status": "delivered",
      "orderType": "dine-in",
      "createdAt": "2026-04-07T14:30:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 15,
    "pages": 1
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### GET `/orders/:id`

Obtener detalles de una orden.

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "restaurantId": 1,
    "locationId": 1,
    "orderNumber": "ORD-2026-0001",
    "totalAmount": 27.97,
    "discountAmount": 0.00,
    "taxAmount": 2.24,
    "status": "delivered",
    "orderType": "dine-in",
    "items": [
      {
        "id": 1,
        "dishId": 1,
        "dishName": "Tacos al Pastor",
        "quantity": 2,
        "unitPrice": 5.99,
        "subtotal": 11.98,
        "specialInstructions": "Sin cebolla"
      }
    ],
    "createdAt": "2026-04-07T14:30:00Z",
    "updatedAt": "2026-04-07T16:30:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### PUT `/orders/:id`

Actualizar estado de orden (solo staff/admin).

**Request Body:**
```json
{
  "status*": "confirmed"
}
```

**Valores válidos de status:**
- `pending` → `confirmed` (cliente confirma)
- `confirmed` → `preparing` (cocina inicia)
- `preparing` → `ready` (orden lista)
- `ready` → `delivered` (entregada)
- `*` → `cancelled` (cualquier estado a cancelado)

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "ORD-2026-0001",
    "status": "confirmed",
    "updatedAt": "2026-04-07T14:35:00Z"
  },
  "timestamp": "2026-04-07T14:35:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `INVALID_STATUS_TRANSITION` | 400 | Transición de estado no válida |
| `ORDER_NOT_FOUND` | 404 | Orden no existe |
| `FORBIDDEN` | 403 | No autorizado para cambiar estado |

---

### DELETE `/orders/:id`

Cancelar orden.

**Request Body:**
```json
{
  "reason": "Cambié de opinión",
  "refundMethod": "original_payment"
}
```

**Response 200 - OK:**
```json
{
  "success": true,
  "message": "Orden cancelada exitosamente",
  "data": {
    "refundAmount": 27.97,
    "refundMethod": "original_payment"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

## Reservations

### POST `/restaurants/:restaurantId/reservations`

Crear reserva.

**Request Body:**
```json
{
  "tableId*": 1,
  "reservationDate*": "2026-04-15",
  "reservationTime*": "19:30",
  "guestCount*": 4,
  "specialRequests": "Celebración de cumpleaños"
}
```

**Response 201 - Created:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "tableId": 1,
    "restaurantId": 1,
    "reservationDate": "2026-04-15",
    "reservationTime": "19:30",
    "guestCount": 4,
    "specialRequests": "Celebración de cumpleaños",
    "status": "confirmed",
    "createdAt": "2026-04-07T14:30:00Z",
    "expiresAt": "2026-04-15T19:45:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `TABLE_NOT_AVAILABLE` | 409 | Mesa no disponible en esa fecha/hora |
| `GUEST_COUNT_EXCEEDS_CAPACITY` | 400 | Comensales exceden capacidad |
| `PAST_DATE` | 400 | Fecha no puede ser en el pasado |
| `NO_AVAILABLE_TABLES` | 404 | No hay mesas disponibles |

---

### GET `/reservations`

Listar reservas del usuario autenticado.

**Query Parameters:**
- `limit` (number): Máximo (default: 20)
- `offset` (number): Saltar (default: 0)
- `status` (enum): `pending`, `confirmed`, `cancelled`, `completed`
- `restaurantId` (number): Filtrar por restaurante
- `startDate` (string): ISO 8601 formato

**Response 200 - OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "restaurantId": 1,
      "restaurantName": "La Esquina",
      "tableId": 1,
      "tableNumber": "A-5",
      "reservationDate": "2026-04-15",
      "reservationTime": "19:30",
      "guestCount": 4,
      "status": "confirmed",
      "createdAt": "2026-04-07T14:30:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 8,
    "pages": 1
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### GET `/reservations/:id`

Obtener detalles de reserva.

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "restaurantId": 1,
    "tableId": 1,
    "tableNumber": "A-5",
    "capacity": 4,
    "reservationDate": "2026-04-15",
    "reservationTime": "19:30",
    "guestCount": 4,
    "specialRequests": "Celebración de cumpleaños",
    "status": "confirmed",
    "createdAt": "2026-04-07T14:30:00Z",
    "expiresAt": "2026-04-15T19:45:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### PUT `/reservations/:id`

Actualizar reserva.

**Request Body:**
```json
{
  "reservationTime": "20:00",
  "guestCount": 5,
  "specialRequests": "Cumpleaños, sin mariscos"
}
```

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "reservationTime": "20:00",
    "guestCount": 5,
    "specialRequests": "Cumpleaños, sin mariscos",
    "updatedAt": "2026-04-07T14:35:00Z"
  },
  "timestamp": "2026-04-07T14:35:00Z"
}
```

---

### DELETE `/reservations/:id`

Cancelar reserva.

**Response 200 - OK:**
```json
{
  "success": true,
  "message": "Reserva cancelada exitosamente",
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

## Reviews

### POST `/restaurants/:restaurantId/reviews`

Crear reseña.

**Request Body:**
```json
{
  "rating*": 5,
  "title": "¡Excelente comida!",
  "comment": "Muy buen servicio, la comida estaba deliciosa",
  "orderId": 1
}
```

**Parametros:**
- `rating` (number): 1-5 estrellas
- `title` (string): Título de la reseña (opcional)
- `comment` (string): Texto de la reseña
- `orderId` (number): Orden asociada (opcional, para verificación)

**Response 201 - Created:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "restaurantId": 1,
    "orderId": 1,
    "rating": 5,
    "title": "¡Excelente comida!",
    "comment": "Muy buen servicio, la comida estaba deliciosa",
    "isVerifiedPurchase": true,
    "helpfulCount": 0,
    "createdAt": "2026-04-07T14:30:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

**Errores Comunes:**

| Código | Status | Descripción |
|--------|--------|-------------|
| `INVALID_RATING` | 400 | Rating debe estar entre 1 y 5 |
| `DUPLICATE_REVIEW` | 409 | Ya existe reseña de este usuario para este restaurante |
| `UNAUTHORIZED` | 401 | Solo usuarios autenticados pueden reseñar |

---

### GET `/restaurants/:restaurantId/reviews`

Listar reseñas de restaurante.

**Query Parameters:**
- `limit` (number): Máximo (default: 20)
- `offset` (number): Saltar (default: 0)
- `rating` (number): Filtrar por rating (1-5)
- `sortBy` (enum): `helpful`, `recent`, `rating` (default: `recent`)

**Response 200 - OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "userName": "Juan Pérez",
      "userAvatar": "https://cdn.example.com/avatars/user-1.jpg",
      "rating": 5,
      "title": "¡Excelente comida!",
      "comment": "Muy buen servicio, la comida estaba deliciosa",
      "isVerifiedPurchase": true,
      "helpfulCount": 12,
      "createdAt": "2026-04-07T14:30:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 45,
    "pages": 3
  },
  "restaurantStats": {
    "averageRating": 4.7,
    "totalReviews": 45,
    "ratingsDistribution": {
      "5": 30,
      "4": 10,
      "3": 3,
      "2": 1,
      "1": 1
    }
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### PUT `/reviews/:id`

Actualizar reseña.

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Actualización: El servicio fue excelente",
  "title": "Buena experiencia"
}
```

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "rating": 4,
    "title": "Buena experiencia",
    "comment": "Actualización: El servicio fue excelente",
    "updatedAt": "2026-04-07T14:35:00Z"
  },
  "timestamp": "2026-04-07T14:35:00Z"
}
```

---

### DELETE `/reviews/:id`

Eliminar reseña.

**Response 200 - OK:**
```json
{
  "success": true,
  "message": "Reseña eliminada exitosamente",
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### POST `/reviews/:id/helpful`

Marcar reseña como útil.

**Request Body:**
```json
{
  "helpful": true
}
```

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "reviewId": 1,
    "helpfulCount": 13,
    "userVote": true
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

## Staff Management

### POST `/restaurants/:restaurantId/staff`

Asignar personal a restaurante (admin only).

**Request Body:**
```json
{
  "userId*": 5,
  "position*": "Chef",
  "hireDate*": "2026-04-07"
}
```

**Response 201 - Created:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 5,
    "userName": "Carlos García",
    "restaurantId": 1,
    "position": "Chef",
    "hireDate": "2026-04-07",
    "endDate": null,
    "isActive": true,
    "createdAt": "2026-04-07T14:30:00Z"
  },
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### GET `/restaurants/:restaurantId/staff`

Listar personal del restaurante.

**Query Parameters:**
- `isActive` (boolean): Solo activos (default: true)
- `position` (string): Filtrar por puesto

**Response 200 - OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 5,
      "userName": "Carlos García",
      "email": "carlos@example.com",
      "position": "Chef",
      "hireDate": "2026-04-07",
      "isActive": true
    }
  ],
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

### PUT `/staff-assignments/:id`

Actualizar asignación de personal.

**Request Body:**
```json
{
  "position": "Sous Chef",
  "endDate": "2026-06-30"
}
```

**Response 200 - OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "position": "Sous Chef",
    "endDate": "2026-06-30",
    "isActive": false,
    "updatedAt": "2026-04-07T14:35:00Z"
  },
  "timestamp": "2026-04-07T14:35:00Z"
}
```

---

### DELETE `/staff-assignments/:id`

Remover personal (marca como inactivo).

**Response 200 - OK:**
```json
{
  "success": true,
  "message": "Personal removido exitosamente",
  "timestamp": "2026-04-07T14:30:00Z"
}
```

---

## Códigos de Error

### Errores de Autenticación (4xx)

| Código | Status | Descripción |
|--------|--------|-------------|
| `UNAUTHORIZED` | 401 | Token no proporcionado o inválido |
| `TOKEN_EXPIRED` | 401 | Token JWT expirado |
| `INVALID_CREDENTIALS` | 401 | Email/contraseña incorrectos |
| `FORBIDDEN` | 403 | Permisos insuficientes |
| `ACCOUNT_INACTIVE` | 403 | Cuenta desactivada |

### Errores de Validación (4xx)

| Código | Status | Descripción |
|--------|--------|-------------|
| `INVALID_DATA` | 400 | Datos incompletos o inválidos |
| `INVALID_EMAIL` | 400 | Formato de email inválido |
| `WEAK_PASSWORD` | 400 | Contraseña no cumple requisitos |
| `INVALID_RATING` | 400 | Rating fuera de rango válido |
| `PAST_DATE` | 400 | Fecha en el pasado no permitida |

### Errores de Recurso (4xx)

| Código | Status | Descripción |
|--------|--------|-------------|
| `RESOURCE_NOT_FOUND` | 404 | Recurso no existe |
| `USER_NOT_FOUND` | 404 | Usuario no existe |
| `RESTAURANT_NOT_FOUND` | 404 | Restaurante no existe |
| `DISH_NOT_FOUND` | 404 | Plato no existe |
| `ORDER_NOT_FOUND` | 404 | Orden no existe |
| `RESERVATION_NOT_FOUND` | 404 | Reserva no existe |
| `REVIEW_NOT_FOUND` | 404 | Reseña no existe |

### Errores de Conflicto (409)

| Código | Status | Descripción |
|--------|--------|-------------|
| `EMAIL_ALREADY_EXISTS` | 409 | Email ya registrado |
| `DUPLICATE_REVIEW` | 409 | Usuario ya reseñó este restaurante |
| `TABLE_NOT_AVAILABLE` | 409 | Mesa no disponible |
| `INVALID_STATUS_TRANSITION` | 409 | Transición de estado no permitida |
| `ACTIVE_ORDERS_EXISTS` | 409 | No se puede eliminar con órdenes activas |

### Errores de Servidor (5xx)

| Código | Status | Descripción |
|--------|--------|-------------|
| `INTERNAL_ERROR` | 500 | Error interno del servidor |
| `DATABASE_ERROR` | 500 | Error en base de datos |
| `SERVICE_UNAVAILABLE` | 503 | Servicio no disponible |

---

## Mejores Prácticas

### Paginación
```
GET /restaurants?limit=20&offset=40
```
Retorna registros del 40 al 60.

### Filtrado Avanzado
```
GET /restaurants?cuisineType=Mexican&isActive=true&sortBy=rating&sortOrder=desc
```

### Búsqueda de Texto
```
GET /restaurants?search=tacos
```

### Timestamps
- Siempre en UTC ISO 8601: `2026-04-07T14:30:00Z`
- Incluyen: `createdAt`, `updatedAt`, `deletedAt` (soft delete)

### Versionado de API
- Todas las rutas incluyen versión: `/v1/`
- Próximas versiones: `/v2/`, `/v3/`

---

**Documento generado**: 7 de abril de 2026  
**Versión**: 1.0  
**Estado**: Listo para implementación
