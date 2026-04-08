---
name: "Agents Index & Navigation"
description: "Mapa completo de archivos de agentes y cómo navegar"
---

# 🗺️ Índice de Agentes - Restaurants Backend

## 📍 Ubicación de Archivos

```
.github/agents/
├── INDEX.md                              ← TÚ ESTÁS AQUÍ
├── README.md                             Quick start guide
├── PROJECT-DIRECTOR-INSTRUCTIONS.md      Meta agent operations
│
├── AGENTS.md (en root)                   Main architecture ~700 líneas
│
├── backend-developer.agent.md            NestJS implementation
├── database-specialist.agent.md          Prisma & PostgreSQL
├── testing-engineer.agent.md             Jest & E2E tests
├── api-architect.agent.md                REST & Swagger
└── devops-engineer.agent.md              Docker & setup
```

---

## 🎯 Qué Archivo Leer Primero

### Si eres nuevo en el proyecto
```
1. README.md (5 min)
   → Entender estructura básica
   
2. AGENTS.md en root (15 min)
   → Visión completa arquitectura
   
3. Tu rol específico (20 min)
   → backend-developer.agent.md
   → (o database-specialist, testing-engineer, api-architect, devops-engineer)
```

### Si necesitas implementar algo AHORA
```
1. README.md → "Flujos de Trabajo Típicos"
   → Encuentra qué flujo corresponde
   
2. AGENTS.md → "Flujos de Ejemplo"
   → Copia el patrón específico
   
3. Tu role agent.md
   → Sigue los checklists
```

### Si tienes conflicto con otro agente
```
1. PROJECT-DIRECTOR-INSTRUCTIONS.md
   → Resolución de conflictos → tú no decides
   → Escala a Project Director / Copilot
```

---

## 📄 Descripción de Cada Archivo

### 1. **README.md** (.github/agents/README.md)
**Para**: Todos (entrada principal)
**Tamaño**: ~400 líneas
**Tiempo de lectura**: 5 minutos
**Contiene**:
- Introducción a arquitectura (1 meta + 5 sub)
- Cómo invocar cada agente
- 3 flujos de trabajo típicos
- Comunicación inter-agentes
- F.A.Q.
- Mapa de archivos relacionados

**Lee esto si**: Acabas de llegar al proyecto

---

### 2. **AGENTS.md** (raíz)
**Para**: Project Director, líderes técnicos
**Tamaño**: ~700 líneas
**Tiempo de lectura**: 20 minutos
**Contiene**:
- Diagrama ASCII de arquitectura
- Responsabilidades del Project Director
- 5 subagentes detallados (especialidades, riesgos, verificaciones)
- Canales de comunicación
- Handoff pattern
- Matriz de riesgos × 5 agentes
- Matriz de restricción de herramientas
- Flujos de ejemplo (3 completos)
- Checklist pre-merge / pre-deploy

**Lee esto si**: Necesitas entender TODO el sistema

---

### 3. **PROJECT-DIRECTOR-INSTRUCTIONS.md**
**Para**: Project Director (Copilot en rol meta-agente)
**Tamaño**: ~600 líneas
**Tiempo de lectura**: 15 minutos
**Contiene**:
- Tu rol específico
- Tus 5 responsabilidades principales (operacionalmente)
- Paso a paso: cómo recibir, analizar, planificar, coordinar, verificar
- Herramientas que SÍ y NO puedes usar
- Riesgos a detectar (señales de alerta)
- Cómo resolver conflictos
- Estados de agentes (monitoreo)
- Cómo comunicarte efectivamente
- Checklist pre "COMPLETADO"
- Ejemplo flujo real completo

**Lee esto si**: Eres el Project Director (Copilot)

---

### 4. **backend-developer.agent.md**
**Para**: Backend Developer (implementación NestJS)
**Tamaño**: ~500 líneas
**Tiempo de lectura**: 15 minutos
**Contenido**:
- Rol y responsabilidades
- 5 responsabilidades clave (módulos, servicios, seguridad, tests, docs)
- Herramientas permitidas/prohibidas
- 4 patrones de implementación:
  - Crear nuevo servicio (template + checklist)
  - Inyección de dependencias (correcto vs incorrecto)
  - Validación con DTOs (class-validator)
  - Error handling (NestJS exceptions)
  - Swagger documentation
- Riesgos (circular dependencies, inyección incompleta, DTOs sin validar, etc)
- Checklists pre/post implementación
- Coordinación con otros agentes
- Stack tecnológico

**Lee esto si**: ✅ Eres Backend Developer

---

### 5. **database-specialist.agent.md**
**Para**: Database Specialist (Prisma y PostgreSQL)
**Tamaño**: ~550 líneas
**Tiempo de lectura**: 15 minutos
**Contenido**:
- Rol y responsabilidades
- 5 responsabilidades clave (schema design, migraciones, optimización, integridad)
- Herramientas (incluye run_in_terminal ⚠️ para prisma migrate, con supervisión)
- 2 patrones Prisma:
  - Modelo simple con relación
  - Relación N:N con datos extra
  - Auditoría temporal
- Gestión completa de migraciones:
  - Creación de nueva migración
  - Estructura de migración SQL
  - Validación pre-migración
  - Rollback seguro
- Estrategia de índices (obligatorios, a evitar)
- Riesgos (~8 riesgos con mitigación)
- Riesgos a vigilar (soft delete olvidado, migraciones no reversibles, etc)
- Checklists pre/post migración
- MCP Supabase (si disponible)
- Ejemplo migración completa

**Lee esto si**: ✅ Eres Database Specialist

---

### 6. **testing-engineer.agent.md**
**Para**: Testing Engineer (Jest + Supertest E2E)
**Tamaño**: ~550 líneas
**Tiempo de lectura**: 15 minutos
**Contenido**:
- Rol y responsabilidades
- Dominios expertos (Jest, Supertest, E2E patterns, coverage)
- Herramientas (read/create/replace ✅, test_failure ✅)
- 4 patrones de testing:
  - Estructura básica E2E (beforeAll, beforeEach, afterEach)
  - Test de éxito (ARRANGE-ACT-ASSERT)
  - Test de error (validaciones, permisos, not found)
  - Setup complejo (cascada: User → Restaurant → Location → Tables)
  - Test helper function (reutilizable)
- Cobertura de test cases por HTTP method
  - GET: success, 404, validation, auth
  - POST: success, validation, conflict, auth, integrity
  - PUT: success, 404, validation, ownership, conflict
  - DELETE: success, 404, ownership, integrity
- Riesgos (tests frágiles, cleanup incompleto, timeouts, hard-coded IDs)
- Checklists
- Coordinación
- Coverage goals por módulo

**Lee esto si**: ✅ Eres Testing Engineer

---

### 7. **api-architect.agent.md**
**Para**: API Architect (REST contracts, OpenAPI, Swagger)
**Tamaño**: ~500 líneas
**Tiempo de lectura**: 15 minutos
**Contenido**:
- Rol y responsabilidades
- Dominios expertos (REST design, OpenAPI, HTTP codes, error taxonomy)
- Herramientas (read/create/replace ✅)
- 4 patrones de diseño:
  - Respuesta exitosa estándar (json structure)
  - Respuesta de error (validación, 404, 409, 401, 403)
  - Contrato de endpoint (con curl example)
  - Paginación (limit, offset, sort, metadata)
  - Versionamiento (/v1/, /v2/)
- Taxonomía de códigos HTTP/error (400, 401, 403, 404, 409, 422, 500, 503)
- Checklists por endpoint
- OpenAPI 3.0 spec + Swagger decorators
- Riesgos
- Documentación (api_contracts.md, Postman_Collection.json, POSTMAN_README.md)
- Ejemplo API completa documentada

**Lee esto si**: ✅ Eres API Architect

---

### 8. **devops-engineer.agent.md**
**Para**: DevOps Engineer (Docker, setup, env vars)
**Tamaño**: ~550 líneas
**Tiempo de lectura**: 15 minutos
**Contenido**:
- Rol y responsabilidades
- Dominios expertos (Docker, Docker Compose, Env config, npm scripts)
- Herramientas (run_in_terminal ✅ para docker)
- 3 patrones configuración:
  - Dockerfile multi-stage (builder → runtime)
  - docker-compose.yml completo (app + postgres + pgadmin)
  - .env.example sin secretos
- npm scripts development
- Docker best practices
  - Imagen optimizada (alpine)
  - Health checks
  - Environment variables handling
- Setup local instructions (7 pasos)
- Checklists
- Verificación pre-completación
- Troubleshooting común (port conflicts, DB not ready, .env missing)
- Performance optimization (image size, startup time, DB)
- Ejemplo setup completo (5 pasos)

**Lee esto si**: ✅ Eres DevOps Engineer

---

## 🔍 Búsqueda Rápida por Tema

### Si necesitas...

**Implementar un módulo**
→ `backend-developer.agent.md` → "Patrones de Implementación"

**Agregar tabla a BD**
→ `database-specialist.agent.md` → "Patrones de Schema Design"

**Escribir tests**
→ `testing-engineer.agent.md` → "Patrones de Testing"

**Documentar API**
→ `api-architect.agent.md` → "Patrones de Diseño API"

**Configurar Docker**
→ `devops-engineer.agent.md` → "Patrones de Configuración"

**Entender arquitectura**
→ `AGENTS.md` en root → "Visión General"

**Operación Project Director**
→ `PROJECT-DIRECTOR-INSTRUCTIONS.md`

**Empezar rápido**
→ `README.md` → "Flujos de Trabajo Típicos"

---

## 📚 Documentos Relacionados (Fuera de .github/agents/)

```
Raíz del proyecto:
├── AGENTS.md                            ← MAIN ARCHITECTURE
│
Docs/E4/
├── db_model.md                          SQL schema (11 entities)
├── api_contracts.md                     REST specs (50+ endpoints)
└── architecture_nest.md                 NestJS blueprint (14 modules)

Aplicación:
├── prisma/schema.prisma                 Prisma models (11 entities)
├── src/                                 NestJS source code
│   └── [modules]
│       ├── restaurants/
│       ├── reservations/
│       ├── orders/
│       └── ...
├── test/                                Testing infrastructure
│   ├── restaurants.e2e-spec.ts          Restaurant tests (620 líneas)
│   ├── reservations.e2e-spec.ts         Reservation tests (550 líneas)
│   ├── test-utils.ts                    Test helpers (450 líneas)
│   └── jest-e2e.config.js               Jest config
├── Dockerfile                           Docker image
├── docker-compose.yml                   Services orchestration
├── .env.example                         Environment template
├── package.json                         Dependencies
├── tsconfig.json                        TypeScript config
└── .gitignore
```

---

## 🎯 Guía Decisión: Cuál Archivo Leer

### Escenario 1: "Soy nuevo, ¿por dónde empiezo?"

```
DÍA 1:
1. README.md (5 min)
   ↓
2. AGENTS.md en root (15 min)
   ↓
DÍA 2:
3. Tu especialidad agent.md (20 min)
   ↓
4. Ejemplo en ese archivo (10 min)
   ↓
LISTO PARA TRABAJAR
```

### Escenario 2: "Necesito implementar X ahora"

```
1. README.md → "Flujos de Trabajo Típicos"
   Encuentra si es: "nuevo endpoint" / "optimize" / "breaking change"
   ↓
2. AGENTS.md → "Flujos de Ejemplo"
   Copia el patrón correspondiente
   ↓
3. Tu role agent.md
   sigue checklists y riesgos
   ↓
4. HACES EL TRABAJO
```

### Escenario 3: "Tengo pregunta sobre X"

```
¿Pregunta sobre...?

NestJS patterns        → backend-developer.agent.md
BD / Prisma            → database-specialist-agent.md
Testing / Jest         → testing-engineer.agent.md
API / REST / Swagger   → api-architect.agent.md
Docker / Setup         → devops-engineer.agent.md
Coordinación global    → AGENTS.md o PROJECT-DIRECTOR-INSTRUCTIONS.md
Quick navigation       → README.md
```

---

## ✍️ Cómo Reportar Algo Completado

Cuando hayas terminado tu parte:

```
"✅ [TU ROL] completado.

QUÉ HICE:
- [Entregable 1]
- [Entregable 2]
- [Entregable 3]

CHECKLIST:
✓ [Verificación 1]
✓ [Verificación 2]
✓ [Verificación 3]

SIGUIENTE:
[Rol siguiente] puede comenzar con [qué].

RIESGOS:
- [Si alguno identificado]"
```

---

## 🤝 Coordinación Inter-Agentes

Cuando necesites algo de otro agente:

```
TÚ: "@ Backend Developer"
"¿Está el módulo Restaurants listo?
Necesito para escribir tests."

Backend Dev: "✅ Listo. Controller + Service.
Aquí está la documentación.
Próximo: DTOs con validadores."

TÚ: "Perfecto, comienzo tests mañana."
```

---

## 📞 Si Algo No Está Documentado

1. Busca en tu agent.md → Sección "Riesgos"
2. Revisa "Coordinación With Other Agents"
3. Pregunta en README.md → "F.A.Q."
4. Si aún no encuentras → Escala a Project Director

---

## 🎓 Aprendizaje Sugerido

**Semana 1**: Leer toda documentación de agentes
**Semana 2-4**: Aplicar en un proyecto pequeño
**Semana 4+**: Experto en tu dominio

**Cada archivo**: 15 minutos lectura, aplicado es 80% comprensión

---

## 📊 Estadísticas

```
Total archivos en .github/agents/:        8
Total líneas de documentación:            ~3,500
Tiempo lectura TOTAL:                    ~1 hora
Promedio por archivo:                    ~7 minutos

Archivos principales:
  AGENTS.md (main)                           ~700 líneas
  Cada agent.md                              ~500 líneas
  README.md                                  ~400 líneas
  PROJECT-DIRECTOR-INSTRUCTIONS.md           ~600 líneas
```

---

## 🚀 Quick Links

- **[README.md](.github/agents/README.md)** - Start here
- **[AGENTS.md](AGENTS.md)** - Main architecture
- **[PROJECT-DIRECTOR-INSTRUCTIONS.md](.github/agents/PROJECT-DIRECTOR-INSTRUCTIONS.md)** - For meta-agent
- **[backend-developer.agent.md](.github/agents/backend-developer.agent.md)** - NestJS
- **[database-specialist.agent.md](.github/agents/database-specialist.agent.md)** - Prisma
- **[testing-engineer.agent.md](.github/agents/testing-engineer.agent.md)** - Jest
- **[api-architect.agent.md](.github/agents/api-architect.agent.md)** - REST
- **[devops-engineer.agent.md](.github/agents/devops-engineer.agent.md)** - Docker

---

## ✅ Verificación

- [ ] Entiendo la arquitectura (1 meta + 5 sub)
- [ ] Sé dónde encontrar archi específico
- [ ] Entiendo cuándo leer cada archivo
- [ ] Sé cómo reportar completitud
- [ ] Puedo coordinar con otros agentes

Si checkeaste todo → **LISTO PARA TRABAJAR** 🚀

---

**Última actualización**: 8 de Abril, 2026
**Versión**: 1.0
**Creado por**: Copilot (GitHub Copilot)
