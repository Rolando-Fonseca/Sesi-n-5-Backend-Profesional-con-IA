# Postman Collection - Restaurants Backend API

Colección Postman completa lista para importar y probar todos los endpoints principales del backend de restaurantes.

## Contenido

### 1. **Environment Setup**
- **Get Auth Token**: Endpoint de login para obtener token JWT
  - Autentica un usuario y guarda el `accessToken`, `refreshToken` y `userId` automáticamente en variables

### 2. **Restaurants**
- **List Restaurants**: GET `/v1/restaurants`
  - Parámetros: `limit`, `offset`, `search`, `sortBy`, `sortOrder`
  - Respuesta: Array de restaurantes con paginación

- **Get Restaurant Details**: GET `/v1/restaurants/{restaurantId}`
  - Obtiene detalles completos del restaurante
  - Incluye ubicaciones y categorías

### 3. **Menu**
- **Get Restaurant Menu**: GET `/v1/restaurants/{restaurantId}/menu`
  - Obtiene todas las categorías con sus platos
  - Incluye detalles de cada plato (precio, tiempo preparación, alérgenos)

### 4. **Reservations**
- **Create Reservation**: POST `/v1/reservations`
  - Crea una nueva reserva
  - Requiere autenticación (Bearer token)
  - Parámetros: `tableId`, `reservationDate`, `reservationTime`, `guestCount`, `specialRequests`

- **Get Reservations List**: GET `/v1/reservations`
  - Lista todas las reservas del usuario autenticado
  - Parámetros: `limit`, `offset`, `status`

- **Get Reservation Details**: GET `/v1/reservations/{reservationId}`
  - Obtiene detalles completos de una reserva
  - Incluye información del usuario, mesa, restaurante y ubicación

- **Update Reservation**: PUT `/v1/reservations/{reservationId}`
  - Actualiza fecha, hora, número de comensales y solicitudes especiales
  - Requiere autenticación
  - Valida disponibilidad de mesa

- **Delete Reservation**: DELETE `/v1/reservations/{reservationId}`
  - Cancela una reserva existente
  - Cambia estado a `CANCELLED`
  - Libera la mesa para otras reservas

## Variables de Entorno

La colección incluye las siguientes variables que se rellenan automáticamente:

| Variable | Descripción | Valor Inicial |
|----------|-------------|---------------|
| `baseUrl` | URL base del API | `http://localhost:3000` |
| `accessToken` | Token JWT del usuario autenticado | `""` (se llena tras login) |
| `refreshToken` | Token para refrescar el accessToken | `""` (se llena tras login) |
| `userId` | ID del usuario autenticado | `""` (se llena tras login) |
| `restaurantId` | ID del restaurante seleccionado | `""` (se llena tras listar restaurantes) |
| `reservationId` | ID de la reserva seleccionada | `""` (se llena tras crear reserva) |

## Cómo Importar

### Opción 1: Importar desde archivo JSON
1. Abre Postman
2. Haz clic en "Import" (botón superior izquierdo)
3. Selecciona "Upload Files"
4. Busca y abre el archivo `Postman_Collection.json`
5. Haz clic en "Import"

### Opción 2: Copiar y pegar
1. Abre Postman
2. Haz clic en "Import"
3. Ve a la pestaña "Raw Text"
4. Copia el contenido de `Postman_Collection.json`
5. Pégalo en el campo de texto
6. Haz clic en "Continue" e "Import"

## Cómo Usar

### Paso 1: Configurar Variables
1. Ve a la sección "Variables" en la colección
2. Edita la variable `baseUrl` si tu API está en un puerto diferente
3. Alternativamente, puedes crear un "Environment" en Postman con las variables

### Paso 2: Autenticarse
1. Ejecuta el request **"Get Auth Token"** en la sección "Environment Setup"
2. Usa credenciales válidas:
   ```json
   {
     "email": "customer@example.com",
     "password": "Password123!"
   }
   ```
3. El token se guardará automáticamente en la variable `accessToken`

### Paso 3: Probar Endpoints

#### Listar Restaurantes
1. Abre el request **"List Restaurants"**
2. Haz clic en "Send"
3. En la respuesta, se seleccionará automáticamente el primer restaurante en `restaurantId`

#### Ver Menú
1. Abre el request **"Get Restaurant Menu"**
2. El `{{restaurantId}}` se reemplazará automáticamente
3. Haz clic en "Send"

#### Crear Reserva
1. Asegúrate de tener un `accessToken` válido (ejecuta "Get Auth Token" primero)
2. Abre el request **"Create Reservation"**
3. Edita el body con:
   - `tableId`: ID válido de mesa disponible
   - `reservationDate`: Fecha en formato YYYY-MM-DD
   - `reservationTime`: Hora en formato HH:MM
   - `guestCount`: Número de comensales
   - `specialRequests`: (opcional) Solicitudes especiales
4. Haz clic en "Send"
5. El ID de la reserva se guardará automáticamente en `reservationId`

#### Actualizar Reserva
1. Abre el request **"Update Reservation"**
2. Modifica los campos que desees cambiar
3. Haz clic en "Send"

#### Cancelar Reserva
1. Abre el request **"Delete Reservation"**
2. Haz clic en "Send"
3. La reserva se marcará como `CANCELLED`

## Tests Automáticos

Cada request incluye tests automáticos que se ejecutan después de recibir la respuesta:

- Validación de código de estado HTTP
- Validación de estructura de respuesta
- Validación de campos requeridos
- Captura automática de variables para siguiente request

Para ver los resultados:
1. Ejecuta un request
2. Ve a la pestaña "Tests" debajo de la respuesta
3. Observa los tests que pasaron o fallaron

## Ejemplos de Respuesta

### Login Success (200)
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "660ac7c9f4ee5f001b7d93a1",
      "email": "customer@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "CUSTOMER"
    }
  }
}
```

### Create Reservation Success (201)
```json
{
  "statusCode": 201,
  "message": "Reservation created successfully",
  "data": {
    "id": "660ac7c9f4ee5f001b7d96a1",
    "user": {
      "id": "660ac7c9f4ee5f001b7d93a1",
      "email": "customer@example.com",
      "firstName": "Juan",
      "lastName": "Pérez"
    },
    "table": {
      "id": "660ac7c9f4ee5f001b7d95a1",
      "number": "5",
      "capacity": 4,
      "status": "RESERVED"
    },
    "reservationDate": "2024-04-15",
    "reservationTime": "19:30",
    "guestCount": 4,
    "specialRequests": "Mesa cerca de la ventana",
    "status": "CONFIRMED",
    "createdAt": "2024-04-08T15:30:00Z",
    "updatedAt": "2024-04-08T15:30:00Z"
  }
}
```

### Error - Table Not Available (409)
```json
{
  "statusCode": 409,
  "error": "TABLE_NOT_AVAILABLE",
  "message": "Table is not available at the specified time",
  "details": {
    "tableId": "occupied-table",
    "reason": "Table is occupied at 19:30 on 2024-04-15"
  }
}
```

## Códigos de Error Comunes

| Código | Error | Significado |
|--------|-------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos inválidos en la solicitud |
| 401 | Unauthorized | Token faltante o inválido |
| 403 | Forbidden | No tienes permiso para acceder |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto (ej: mesa no disponible) |
| 500 | Internal Server Error | Error del servidor |

## Flujo Recomendado de Testing

1. **Autenticación**
   - Ejecuta "Get Auth Token"

2. **Exploración**
   - Ejecuta "List Restaurants"
   - Ejecuta "Get Restaurant Menu"

3. **Reservas**
   - Ejecuta "Create Reservation"
   - Ejecuta "Get Reservations List"
   - Ejecuta "Get Reservation Details"
   - Ejecuta "Update Reservation"
   - Ejecuta "Delete Reservation"

## Troubleshooting

### Error: "Table is not available"
- Verifica que la fecha y hora sean válidas
- Asegúrate de que la mesa no esté ocupada en esa hora

### Error: "Guest count exceeds table capacity"
- Reduce el número de comensales
- O selecciona una mesa con mayor capacidad

### Error: "Unauthorized"
- Ejecuta "Get Auth Token" para obtener un nuevo token
- Verifica que el token no haya expirado

### Las variables no se cargan
- Asegúrate de ejecutar "Get Auth Token" primero
- Verifica que los tests estén habilitados
- Mira la consola de Postman (View → Show Postman Console)

## Notas Adicionales

- Los datos en las respuestas de ejemplo son ficticios
- Los IDs en los ejemplos son IDs reales de MongoDB
- Las fechas/horas deben estar siempre en el futuro para crear reservas
- Los tokens JWT expiran (típicamente en 1 hora)
- Usa "Get Auth Token" nuevamente si recibas erro 401

## Contacto y Soporte

Para preguntas o problemas con la colección:
- Revisa los logs en la consola de Postman
- Verifica que el servidor esté corriendo en `http://localhost:3000`
- Comprueba la documentación de la API en `/v1/docs`
