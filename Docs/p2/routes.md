# P2 — Documentacion de Rutas

## Stack de rutas

```
/                        → Landing page (home)
/restaurants             → Catalogo de restaurantes
/restaurants/:id         → Detalle de un restaurante
```

Router: React Router v7 (o TanStack Router)

---

## Ruta `/` — Landing

### Proposito

Pagina principal del sitio. Landing de un solo restaurante con scroll vertical por secciones. Es la experiencia predeterminada del visitante: descubre el restaurante, ve su menu, lee reseñas y puede reservar.

### Datos que consume

| Peticion | Endpoint | Cuando |
|----------|----------|--------|
| Restaurante | `GET /restaurants/:id` | Inmediato al montar la pagina |
| Categorias | `GET /menus?restaurantId=:id` | Al entrar en viewport la seccion Menu |
| Platos | `GET /menu-items?locationId=:menuId` | Al seleccionar categoria o entrar en viewport |
| Ubicaciones | `GET /menus?restaurantId=:id` (Locations) | Al entrar en viewport la seccion Ubicaciones |
| Reseñas | `GET /reviews?restaurantId=:id&limit=6&sortBy=date` | Al entrar en viewport la seccion Reseñas |
| Crear reserva | `POST /bookings` | Al enviar el formulario |

> `restaurantId` se resuelve al cargar la pagina. Para MVP: primer resultado de `GET /restaurants` o ID hardcodeado.

### Componentes principales

```
<HomePage>
  <Hero />                  ← nombre, cocina, CTA, imagen fondo
  <AboutSection />          ← descripcion, contacto, imagen chef
  <MenuSection />           ← tabs de categoria + grid de platos
    <CategoryTabs />
    <MenuItemCard />        ← nombre, precio, imagen, disponibilidad
  <LocationsSection />      ← tarjetas de ubicacion con horarios
    <LocationCard />
  <BookingSection />        ← formulario de reserva
    <BookingForm />
    <BookingConfirmation /> ← aparece post-envio exitoso
  <ReviewsSection />        ← grid de reseñas + resumen rating
    <RatingSummary />       ← promedio, distribucion de estrellas
    <ReviewCard />          ← estrellas, titulo, comentario, fecha
  <Footer />                ← contacto, links, horarios
```

### Estados

| Seccion | Cargando | Error | Vacio |
|---------|----------|-------|-------|
| Hero | Skeleton titulo + descripcion shimmer | Fondo oscuro, nombre generico "Restaurante" | No aplica |
| About | Bloque gris + lineas skeleton | "No pudimos cargar la informacion" + boton reintentar | "Aun no hemos agregado nuestra historia" |
| Menu | Grid de cards skeleton (imagen + 3 lineas) | "Error al cargar el menu" + reintentar | "Aun no tenemos platos. Vuelve pronto!" |
| Locations | Placeholders de direccion | "No pudimos cargar las ubicaciones" + reintentar | "No tenemos ubicaciones registradas. Contactanos" |
| Booking | Boton deshabilitado + spinner "Reservando..." | Toast "Error al crear la reserva. Intenta de nuevo" | No aplica (es un formulario) |
| Reviews | Cards skeleton | "No pudimos cargar las reseñas" + reintentar | "Se el primero en dejarnos tu reseña!" |
| Footer | Skeleton | Datos minimos hardcodeados | Solo links de navegacion |

---

## Ruta `/restaurants` — Catalogo

### Proposito

Directorio de todos los restaurantes registrados. Permite buscar, filtrar por tipo de cocina y navegar al detalle. Es la puerta de entrada cuando no hay un restaurante especifico en contexto.

### Datos que consume

| Peticion | Endpoint | Cuando |
|----------|----------|--------|
| Lista de restaurantes | `GET /restaurants?search=&cuisineType=&limit=12&offset=0` | Al montar la pagina |
| Busqueda | `GET /restaurants?search=termino` | Al escribir en el buscador (debounce 300ms) |
| Filtro cocina | `GET /restaurants?cuisineType=Mexican` | Al seleccionar filtro |
| Paginacion | `GET /restaurants?offset=12` | Al hacer scroll o clic en "Cargar mas" |

### Componentes principales

```
<RestaurantsPage>
  <PageHeader />             ← titulo "Restaurantes", buscador
    <SearchBar />            ← input con debounce
    <CuisineFilter />        ← pills de tipo de cocina
  <RestaurantsGrid />        ← grid responsivo de tarjetas
    <RestaurantCard />       ← nombre, cocina, descripcion, rating
  <LoadMoreButton />         ← paginacion con offset
```

### Datos por tarjeta (RestaurantCard)

```
┌──────────────────────┐
│  [Imagen Unsplash]   │  ← imagen por cuisineType o default
│                      │
│  Nombre              │  ← name
│  Tipo de cocina      │  ← cuisineType (badge)
│  Descripcion corta   │  ← description (truncado 80 chars)
│  ★ 4.5 · 23 reseñas │  ← calculado desde reviews (si disponible)
└──────────────────────┘
```

### Estados

| Estado | Visual |
|--------|--------|
| **Carga inicial** | Grid de 6-12 cards skeleton con shimmer |
| **Carga busqueda** | Overlay sutil sobre el grid existente + spinner inline en el buscador |
| **Carga paginacion** | Spinner al final del grid, cards existentes visibles |
| **Error** | "Error al cargar los restaurantes" + boton reintentar |
| **Error de red** | Ilustracion sin conexion + "Sin conexion a internet" + reintentar |
| **Sin resultados** | Ilustracion + "No encontramos restaurantes con esos criterios" + sugerir limpiar filtros |
| **Lista vacia** | Ilustracion + "Aun no hay restaurantes registrados" |
| **Cargando mas** | Spinner small + texto "Cargando mas..." |

---

## Ruta `/restaurants/:id` — Detalle

### Proposito

Pagina completa de un restaurante especifico. Mismo contenido que la landing `/` pero enfocado en un restaurante particular. Incluye toda la informacion, menu, ubicaciones, reseñas y reserva.

### Datos que consume

| Peticion | Endpoint | Cuando |
|----------|----------|--------|
| Restaurante | `GET /restaurants/:id` | Inmediato (param de URL) |
| Categorias | `GET /menus?restaurantId=:id` | Al entrar en viewport |
| Platos | `GET /menu-items?locationId=:menuId` | Al seleccionar categoria o entrar en viewport |
| Ubicaciones | `GET /menus?restaurantId=:id` (Locations) | Al entrar en viewport |
| Reseñas | `GET /reviews?restaurantId=:id&limit=6&sortBy=date` | Al entrar en viewport |
| Crear reserva | `POST /bookings` | Al enviar formulario |

### Componentes principales

```
<RestaurantDetailPage>
  <RestaurantHeader />       ← nombre, cocina, rating, foto portada
  <RestaurantNav />          ← tabs sticky: Menu · Ubicaciones · Reseñas · Reservar
  <MenuSection />            ← igual que HomePage
    <CategoryTabs />
    <MenuItemCard />
  <LocationsSection />       ← igual que HomePage
    <LocationCard />
  <ReviewsSection />         ← igual que HomePage
    <RatingSummary />
    <ReviewCard />
  <BookingSection />         ← igual que HomePage
    <BookingForm />
    <BookingConfirmation />
  <RestaurantFooter />       ← contacto del restaurante + volver al catalogo
```

### Diferencias con `/` (Landing)

| Aspecto | `/` (Landing) | `/restaurants/:id` (Detalle) |
|---------|---------------|------------------------------|
| Navegacion | Scroll vertical fluido | Tabs sticky + scroll por seccion |
| Header | Hero con imagen fullwidth | Header compacto con foto portada |
| RestaurantId | Resuelto automaticamente | Parametro de URL (`:id`) |
| Volver | No aplica | Link "Volver al catalogo" |
| SEO | Titulo generico | Titulo con nombre del restaurante |

### Estados

| Estado | Visual |
|--------|--------|
| **Carga restaurante** | Page skeleton completa (header + secciones con shimmer) |
| **Restaurante no encontrado** | 404: "Este restaurante no existe o fue eliminado" + link al catalogo |
| **Error de carga** | "Error al cargar el restaurante" + reintentar + link al catalogo |
| **Carga secciones** | Mismos skeletons que la landing por seccion |
| **Error secciones** | Mismos patrones que la landing, error por seccion independiente |

---

## Mapa de navegacion

```
/ (Landing)
  │
  ├── scroll → Menu → Ubicaciones → Reservas → Reseñas
  │
  └── link → /restaurants (Catalogo)
                │
                └── click tarjeta → /restaurants/:id (Detalle)
                                      │
                                      ├── tabs → Menu · Ubicaciones · Reseñas · Reservar
                                      │
                                      └── link → /restaurants (volver)
```

## Estrategia de prefetching

| Ruta origen | Ruta destino | Estrategia |
|-------------|-------------|------------|
| `/` | `/restaurants` | Prefetch al hover del link "Ver restaurantes" |
| `/restaurants` | `/restaurants/:id` | Prefetch al hover de cada `RestaurantCard` |
| Cualquiera | `/` | Sin prefetch (es la landing, carga directa) |

## Hook de datos sugerido

```ts
// Hook por ruta — patron useQuery (TanStack Query)

// /restaurants
function useRestaurants(filters: { search?: string; cuisineType?: string; offset?: number }) {
  return useQuery({
    queryKey: ['restaurants', filters],
    queryFn: () => api.get('/restaurants', { params: filters }),
  })
}

// /restaurants/:id
function useRestaurant(id: string) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => api.get(`/restaurants/${id}`),
    enabled: !!id,
  })
}

// Sub-recursos del restaurante
function useRestaurantMenu(restaurantId: string) { /* ... */ }
function useRestaurantReviews(restaurantId: string) { /* ... */ }
function useRestaurantLocations(restaurantId: string) { /* ... */ }
function useCreateBooking() {
  return useMutation({
    mutationFn: (data: BookingPayload) => api.post('/bookings', data),
  })
}
```
