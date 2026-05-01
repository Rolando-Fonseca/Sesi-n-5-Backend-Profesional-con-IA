# P2 — Landing del Restaurante: Estructura Conceptual

## Vision general

Landing page publica de un restaurante que consume datos reales del backend NestJS/Prisma. El objetivo es que un restaurante pueda mostrar su informacion, menu, ubicaciones, reseñas y recibir reservas — todo desde una sola pagina con scroll fluido.

**Stack**: React 19 + Vite + TypeScript + TailwindCSS

---

## Secciones principales

### 1. Hero

**Proposito**: Primera impresion. Comunicar nombre, tipo de cocina y llamado a la accion (reservar o ver menu).

| Elemento | Tipo | Fuente |
|----------|------|--------|
| Nombre del restaurante | Dinamico | `GET /restaurants/:id` → `name` |
| Tipo de cocina | Dinamico | `GET /restaurants/:id` → `cuisineType` |
| Descripcion corta | Dinamico | `GET /restaurants/:id` → `description` |
| Imagen de fondo | Estatica | Unsplash — restaurante/food hero |
| CTA "Reservar Mesa" | Accion | Scroll a seccion de reservas |
| CTA "Ver Menu" | Accion | Scroll a seccion de menu |

**Imagen sugerida**: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80` (interior restaurante elegante)

**Estados**:
- **Carga**: Skeleton del titulo + descripcion con shimmer
- **Error**: Fallback con nombre generico "Restaurante" y fondo oscuro
- **Vacio**: No aplica (siempre hay restaurante por defecto)

---

### 2. Sobre Nosotros

**Proposito**: Generar confianza y conexio emocional. Contar la historia del restaurante.

| Elemento | Tipo | Fuente |
|----------|------|--------|
| Descripcion completa | Dinamico | `GET /restaurants/:id` → `description` |
| Telefono | Dinamico | `GET /restaurants/:id` → `phone` |
| Email | Dinamico | `GET /restaurants/:id` → `email` |
| Website | Dinamico | `GET /restaurants/:id` → `website` |
| Imagen lateral | Estatica | Unsplash — chef cocinando / interior cocina |

**Imagen sugerida**: `https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80` (chef en accion)

**Estados**:
- **Carga**: Bloque con placeholder gris + lineas de texto skeleton
- **Error**: Mensaje "No pudimos cargar la informacion del restaurante" con boton reintentar
- **Vacio**: Texto placeholder "Aun no hemos agregado nuestra historia"

---

### 3. Menu

**Proposito**: Mostrar los platos disponibles organizados por categoria. Es la seccion mas importante para conversion.

| Elemento | Tipo | Fuente |
|----------|------|--------|
| Lista de categorias | Dinamico | `GET /menus?restaurantId=:id` → agrupar por `name` |
| Platos por categoria | Dinamico | `GET /menu-items?locationId=:menuId` |
| Nombre del plato | Dinamico | `name` |
| Descripcion | Dinamico | `description` |
| Precio | Dinamico | `price` (formateado como moneda) |
| Imagen del plato | Dinamico/Static | `imageUrl` si existe, sino Unsplash fallback por categoria |
| Disponibilidad | Dinamico | `availability` (badge: disponible/temporada/no disponible) |

**Imagenes fallback por categoria (Unsplash)**:
- Entradas: `https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&q=80`
- Platos fuertes: `https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80`
- Postres: `https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80`
- Bebidas: `https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80`

**Interaccion**:
- Tabs o pills para filtrar por categoria
- Animacion de entrada al cambiar categoria
- Badge visual en platos no disponibles

**Estados**:
- **Carga**: Grid de cards con skeleton (imagen + 3 lineas de texto)
- **Error**: "Error al cargar el menu" con boton reintentar
- **Vacio**: Ilustracion + "Aun no tenemos platos en el menu. Vuelve pronto!"

---

### 4. Ubicaciones

**Proposito**: Mostrar donde encontrar el restaurante. Datos de contacto y direccion por sede.

| Elemento | Tipo | Fuente |
|----------|------|--------|
| Lista de ubicaciones | Dinamico | `GET /menus?restaurantId=:id` (modelo Location) |
| Direccion | Dinamico | `address`, `city`, `state`, `zipCode` |
| Telefono general | Dinamico | `GET /restaurants/:id` → `phone` |
| Horario | Dinamico | `openingTime` / `closingTime` (del modelo Location) |
| Sede principal | Dinamico | `isPrimary` flag |
| Mapa estatico | Generado | Embed Google Maps o imagen estatica basada en lat/lng |

**Imagen sugerida**: `https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80` (fachada restaurante)

**Estados**:
- **Carga**: Lista con placeholders de direccion
- **Error**: "No pudimos cargar las ubicaciones" con reintentar
- **Vacio**: "Aun no tenemos ubicaciones registradas. Contactanos directamente"

---

### 5. Reservas

**Proposito**: Conversion directa. Permitir al visitante reservar una mesa sin salir de la landing.

| Elemento | Tipo | Fuente |
|----------|------|--------|
| Formulario de reserva | Input | Campos: fecha, hora, invitados, nombre, telefono, email, solicitudes especiales |
| Envio | POST | `POST /bookings` |
| Confirmacion | UI | Feedback visual post-envio exitoso |
| Selector de ubicacion | Dinamico | `GET /menus?restaurantId=:id` → lista de sedes |

**Campos del formulario**:
| Campo | Tipo | Validacion | Mapeo API |
|-------|------|------------|-----------|
| Fecha | Date picker | Fecha futura | `reservationDateTime` (combined) |
| Hora | Time picker | Dentro de horario | `reservationDateTime` (combined) |
| Numero de invitados | Select (1-20) | Requerido | `numberOfGuests` |
| Nombre | Text input | Requerido | `guestName` |
| Telefono | Tel input | Requerido | `guestPhone` |
| Email | Email input | Requerido | `guestEmail` |
| Solicitudes especiales | Textarea | Opcional, max 500 | `specialRequests` |

**Nota**: `restaurantId` y `userId` se asignan automaticamente. `userId` requiere auth — temporalmente se puede usar un valor por defecto o guest booking.

**Estados**:
- **Carga (envio)**: Boton deshabilitado + spinner "Reservando..."
- **Exito**: Card de confirmacion con datos de la reserva + confetti/success animation
- **Error (validacion)**: Mensajes inline por campo
- **Error (servidor)**: Toast "Error al crear la reserva. Intenta de nuevo."

---

### 6. Reseñas

**Proposito**: Prueba social. Mostrar la experiencia de otros clientes para generar confianza.

| Elemento | Tipo | Fuente |
|----------|------|--------|
| Lista de reseñas | Dinamico | `GET /reviews?restaurantId=:id&limit=6&sortBy=date` |
| Calificacion promedio | Calculado | Promedio de `rating` del array |
| Estrellas | Dinamico | `rating` (1-5) |
| Titulo | Dinamico | `title` |
| Comentario | Dinamico | `comment` |
| Fecha | Dinamico | `createdAt` (formateado) |
| Total de reseñas | Calculado | Length del array |
| Distribucion de estrellas | Calculado | Conteo agrupado por rating |

**Interaccion**:
- Carrusel horizontal o grid 2x3
- Ver mas reseñas (paginacion)
- Filtro por minRating

**Imagen sugerida**: `https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80` (gente disfrutando comida)

**Estados**:
- **Carga**: Cards de reseñas con skeleton
- **Error**: "No pudimos cargar las reseñas" con reintentar
- **Vacio**: "Se el primero en dejarnos tu reseña!" + CTA

---

### 7. Footer

**Proposito**: Cierre de navegacion. Links rapidos, contacto legal y redes sociales.

| Elemento | Tipo | Fuente |
|----------|------|--------|
| Nombre restaurante | Dinamico | `GET /restaurants/:id` → `name` |
| Telefono | Dinamico | `phone` |
| Email | Dinamico | `email` |
| Website | Dinamico | `website` |
| Links de navegacion | Estaticos | Anchor scroll a cada seccion |
| Redes sociales | Estaticos | Placeholders (no hay campo en API) |
| Horario | Dinamico | Desde ubicaciones |

**Estados**:
- **Carga**: Skeleton del footer
- **Error**: Footer con datos minimos hardcodeados
- **Vacio**: Footer con solo links de navegacion

---

## Mapa de endpoints por seccion

```
SECCION          ENDPOINT                              DATOS USADOS
─────────────────────────────────────────────────────────────────────
Hero             GET /restaurants/:id                  name, cuisineType, description
Sobre Nosotros   GET /restaurants/:id                  description, phone, email, website
Menu             GET /menus?restaurantId=:id           categorias (menus)
                 GET /menu-items?locationId=:menuId    platos con precio, imagen, disponibilidad
Ubicaciones      GET /menus?restaurantId=:id           locations: address, city, hours
Reservas         POST /bookings                        crear reserva
                 GET /menus?restaurantId=:id           selector de sede
Reseñas          GET /reviews?restaurantId=:id         rating, title, comment, createdAt
Footer           GET /restaurants/:id                  name, phone, email, website
```

## Flujo de datos principal

```
App load
  ├── GET /restaurants/:id          → Context global del restaurante
  │     ├── Hero
  │     ├── Sobre Nosotros
  │     └── Footer
  ├── GET /menus?restaurantId=:id   → Categorias + ubicaciones
  │     ├── Menu (categorias)
  │     └── Ubicaciones
  ├── GET /menu-items?locationId=   → Platos del menu (por ubicacion)
  │     └── Menu (items)
  ├── GET /reviews?restaurantId=:id → Reseñas
  │     └── Reseñas
  └── POST /bookings                → Crear reserva (on submit)
        └── Reservas
```

## Estrategia de carga

1. **Restaurante primero**: El `GET /restaurants/:id` es critico — cargar en el layout raiz y proveer via context
2. **Menu lazy**: Cargar categorias e items cuando el usuario se acerca al scroll (Intersection Observer)
3. **Reseñas lazy**: Cargar cuando la seccion entra al viewport
4. **Reservas formulario**: No cargar datos hasta que el usuario interactue con el formulario
5. **Skeletons unificados**: Cada seccion muestra su skeleton mientras carga de forma independiente

## Convenciones de estados

| Estado | Patron visual |
|--------|---------------|
| **Carga inicial** | Skeleton con animacion shimmer (gris claro → gris oscuro → gris claro) |
| **Carga parcial** | Spinner pequeno inline o pulsing en el elemento que se actualiza |
| **Error** | Icono de alerta + mensaje descriptivo + boton "Reintentar" |
| **Vacio** | Ilustracion sutil + mensaje contextual + CTA si aplica |
| **Exito** | Check animation + mensaje de confirmacion + transicion suave |

## Notas de implementacion

- **restaurantId**: Se necesita definir como obtener el ID del restaurante actual (URL param, subdominio, o config). Para MVP, hardcodear el primer restaurante de `GET /restaurants`.
- **Auth**: Los endpoints de booking requieren `userId`. Para la landing publica, se puede crear un endpoint guest o usar un usuario generico hasta que el modulo de auth este listo.
- **Imagenes**: Las URLs de Unsplash son placeholders. Cuando el backend soporte `imageUrl` en platos y `logoUrl` en restaurantes, priorizar esas.
- **Responsive**: Todas las secciones deben funcionar en mobile-first. El menu en mobile puede usar un carrusel horizontal en vez de grid.
