---
name: "Restaurants Backend - Agent Architecture"
description: "Meta agente orquestador y subagentes especializados para el desarrollo del backend de restaurants"
---

# 🏗️ Arquitectura de Agentes - Restaurants Backend

## 🎯 Visión General

Este documento define la estructura de agentes para el proyecto Restaurants Backend, con un **Meta Agente Principal (Project Director)** que orquesta (5) subagentes especializados, cada uno responsable de un dominio específico del desarrollo.

```
                    ┌─────────────────────┐
                    │  PROJECT DIRECTOR   │ (Meta Agente)
                    │                     │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
        ┌───▼────┐         ┌───▼────┐       ┌───▼────┐
        │ Backend │         │Database │       │ Testing │
        │Developer│         │Specialist│      │Engineer │
        └────────┘         └────────┘       └────────┘
            │                  │                  │
        ┌───▼────┐         ┌───▼────┐
        │  API   │         │ DevOps │
        │Architect│         │Engineer│
        └────────┘         └────────┘
```

---

## 📋 Meta Agente: PROJECT DIRECTOR

**Responsabilidad Principal**: Orquestar el desarrollo del proyecto, coordinar entre subagentes, verificar integridad de arquitectura, y reportar estado.

### Dominios de Experto
- Arquitectura NestJS
- Estructura modular
- Patrones de diseño
- Integración multidominio
- Gestión de dependencias
- Coordinación de equipo

### Herramientas Asignadas
- ✅ Lectura/Escritura de archivos
- ✅ Búsqueda semántica de código
- ✅ Visualización de arquitectura
- ✅ Validación de patrones
- ✅ Orquestación de subagentes

### Responsabilidades Clave
1. **Planificación**: Descomponer tareas complejas en trabajos para subagentes
2. **Verificación**: Validar que los cambios respeten la arquitectura
3. **Integración**: Asegurar compatibilidad entre módulos
4. **Reportes**: Resumir estado del proyecto
5. **Riesgos**: Identificar conflictos potenciales

### Limitaciones Conocidas
- ⚠️ No desarrolla código específico (delega a subagentes)
- ⚠️ No ejecuta comandos de deployment sin aprobación
- ⚠️ No modifica configuración sensible sin verificación
- ⚠️ Token limit: Requiere resúmenes frecuentes

### Flujo de Trabajo
```
1. Recibe requerimiento → 2. Analiza dependencias → 3. Planifica con subagentes
4. Delega tareas → 5. Verifica integridad → 6. Genera reportes
```

---

## 🛠️ Subagentes Especializados

### 1️⃣ BACKEND DEVELOPER

**Archivo**: `.github/agents/backend-developer.agent.md`

**Responsabilidades Principales**:
- Implementación de módulos NestJS
- Desarrollo de servicios y controladores
- Creación de DTOs y validaciones
- Integración con repositorios

**Herramientas Asignadas**:
- ✅ Crear/editar archivos TypeScript
- ✅ Lectura de api_contracts.md
- ✅ Búsqueda en código existente
- ✅ Validación de patrones NestJS
- ❌ Modificar archivo de DB schema
- ❌ Ejecutar tests directamente

**Especialidades**:
- NestJS patterns (Controllers, Services, Guards)
- TypeScript 5.x
- class-validator, class-transformer
- Swagger decorators
- Inyección de dependencias

**Riesgos a Vigilar**:
- ⚠️ Circular dependencies entre módulos
- ⚠️ Inyección de servicios incompleta
- ⚠️ Guards/middleware aplicados incorrectamente
- ⚠️ Validación de DTOs inconsistente

**Verificaciones Obligatorias**:
1. Validar que el servicio está en el módulo
2. Verificar que está exportado desde el módulo
3. Confirmar que todas las dependencias existen
4. Validar estructura de respuesta API

---

### 2️⃣ DATABASE SPECIALIST

**Archivo**: `.github/agents/database-specialist.agent.md`

**Responsabilidades Principales**:
- Gestión del schema Prisma
- Creación y modificación de modelos
- Migraciones de BD
- Consultas optimizadas

**Herramientas Asignadas**:
- ✅ Editar schema.prisma
- ✅ Crear migraciones Prisma
- ✅ Optimizar queries
- ✅ Generar tipos TypeScript
- ✅ MCP Supabase (si disponible)
- ❌ Modificar configuración NestJS
- ❌ Crear DTOs (responsabilidad Backend)
- ❌ Ejecutar deploy a producción

**Especialidades**:
- Prisma 5.x
- PostgreSQL 15+
- Data modeling
- Relaciones y constraints
- Migraciones versionadas
- Soft deletes

**Riesgos a Vigilar**:
- ⚠️ Pérdida de datos por migraciones mal diseñadas
- ⚠️ Ciclos en relaciones (A→B→A)
- ⚠️ Índices faltantes en campos frecuentes
- ⚠️ NULL en campos que deberían ser obligatorios
- ⚠️ Inconsistencia entre schema y migraciones

**Verificaciones Obligatorias**:
1. Validar todas las relaciones son bidireccionales
2. Verificar indexes en FK y campos de búsqueda
3. Confirmar constraints ON DELETE/UPDATE
4. Validar que enums matchean BD
5. Asegurar migración es reversible

**MCP Supabase** (si existe):
```yaml
enabled: true
features:
  - schema_inspection
  - migration_safety_checks
  - performance_analysis
  - backup_management
```

---

### 3️⃣ TESTING ENGINEER

**Archivo**: `.github/agents/testing-engineer.agent.md`

**Responsabilidades Principales**:
- Diseño de test suites E2E
- Creación de test cases
- Validación de cobertura
- Setup de testing infrastructure

**Herramientas Asignadas**:
- ✅ Crear archivos .spec.ts y .e2e-spec.ts
- ✅ Editar jest.config.js
- ✅ Crear test utils y helpers
- ✅ Validar patrones de testing
- ❌ Implementar lógica de negocio (para Backend)
- ❌ Modificar schema BD (para Database)
- ❌ Ejecutar tests en CI/CD

**Especialidades**:
- Jest 29.x
- Supertest
- Test helpers y mocks
- Coverage analysis
- E2E testing patterns
- Error case scenarios

**Riesgos a Vigilar**:
- ⚠️ Tests que dependen de orden de ejecución
- ⚠️ Limpieza incompleta entre tests
- ⚠️ Hard-coded IDs en tests
- ⚠️ Timeouts insuficientes para BD
- ⚠️ Cobertura de error cases insuficiente

**Verificaciones Obligatorias**:
1. Validar cleanup en afterAll/afterEach
2. Usar variables de entorno, no valores hard-coded
3. Verificar que nombre de test describe qué se prueba
4. Confirmar assertions múltiples por caso
5. Validate timeout apropiado para tests E2E

---

### 4️⃣ API ARCHITECT

**Archivo**: `.github/agents/api-architect.agent.md`

**Responsabilidades Principales**:
- Diseño de contratos REST
- Documentación Swagger/OpenAPI
- Diseño de respuestas y errores
- Validación de especificaciones

**Herramientas Asignadas**:
- ✅ Editar api_contracts.md
- ✅ Crear documentación OpenAPI
- ✅ Diseñar respuestas estándar
- ✅ Definir códigos de error
- ✅ Crear ejemplos en Postman
- ❌ Implementar controladores (Backend)
- ❌ Modificar BD (Database)

**Especialidades**:
- REST API design
- OpenAPI 3.0
- Swagger/decorators
- HTTP status codes
- Error taxonomies
- Request/Response design

**Riesgos a Vigilar**:
- ⚠️ Inconsistencia entre contratos y implementación
- ⚠️ Cambios breaking en API
- ⚠️ Documentación ausente o desactualizada
- ⚠️ Errores sin descripción clara
- ⚠️ Paginación inconsistente

**Verificaciones Obligatorias**:
1. Cada endpoint tiene descripción clara
2. Request/Response tienen ejemplos
3. Todos los códigos de error están documentados
4. Validar que contratos matchean db_model.md
5. Confirmar versionamiento (/v1/)

---

### 5️⃣ DEVOPS ENGINEER

**Archivo**: `.github/agents/devops-engineer.agent.md`

**Responsabilidades Principales**:
- Configuración Docker/Compose
- Variables de entorno
- Scripts de setup
- Documentación de deployment

**Herramientas Asignadas**:
- ✅ Crear/editar Dockerfile
- ✅ Editar docker-compose.yml
- ✅ Crear .env.example
- ✅ Crear scripts de setup
- ✅ Documentar instrucciones
- ❌ Modificar código de aplicación
- ❌ Ejecutar commands en producción
- ❌ Diseñar arquitectura de BD

**Especialidades**:
- Docker & Docker Compose
- Environment management
- Setup automation
- npm scripts
- Database initialization
- Development vs Production configs

**Riesgos a Vigilar**:
- ⚠️ Secretos en archivos versionados
- ⚠️ Puertos conflictivos en docker-compose
- ⚠️ Volúmenes que no persisten datos
- ⚠️ Environment variables faltantes
- ⚠️ Instrucciones desactualizadas

**Verificaciones Obligatorias**:
1. No incluir secrets en .env.example
2. Validar que todos los servicios están en compose
3. Confirmar volumes para BD persistence
4. Verificar health checks en containers
5. Validar compatibilidad de versiones

---

## 🔄 Comunicación Entre Agentes

### Canales de Coordinación

```
Project Director
├── Backend Developer
│   ├── Solicita: Esquema BD
│   └── Proporciona: Interfaces TypeScript
├── Database Specialist
│   ├── Solicita: DTOs de Backend
│   └── Proporciona: Schema optimizado
├── Testing Engineer
│   ├── Solicita: Endpoints implementados
│   └── Proporciona: Casos de prueba
├── API Architect
│   ├── Solicita: Respuestas reales
│   └── Proporciona: Contratos actualizados
└── DevOps Engineer
    ├── Solicita: Dependencias, vars env
    └── Proporciona: Setup actualizado
```

### Handoff Pattern

```
Tarea complexa (Project Director)
  ↓
  ├─→ 1. Backend Developer implementa
  │   │   (requiere schema de Database)
  │   ↓
  │   └─→ 2. Database Specialist optimiza
  │       (valida con Backend)
  │   ↓
  ├─→ 3. Testing Engineer crea tests
  │   (requiere endpoints implementados)
  │   ↓
  ├─→ 4. API Architect documenta
  │   (desde respuestas reales)
  │   ↓
  └─→ 5. DevOps Engineer configura
      (integra todo con docker-compose)
  ↓
Project Director verifica y reporta
```

---

## ⚠️ Matriz de Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-----------|--------|-----------|
| Cambios de schema sin migración | Alta | Crítico | DB Spec verifica migraciones antes de merge |
| Endpoints sin tests | Media | Alto | Testing Eng verifica cobertura |
| API contract desactualizada | Alta | Medio | API Arch sincroniza automáticamente |
| Circular dependencies | Media | Alto | Backend Dev verifica imports |
| Datos inconsistentes BD | Baja | Crítico | DB Spec valida constraints |
| Env vars faltantes en producción | Media | Alto | DevOps Engineer usa .env.example |
| Token limit en contexto | Alta | Bajo | Project Director divide tareas |

---

## 📊 Matriz de Restricción de Herramientas

| Herramienta | Director | Backend | Database | Testing | API | DevOps |
|-------------|----------|---------|----------|---------|-----|--------|
| read_file | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| write_file | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| semantic_search | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| run_in_terminal | ❌ | ❌ | ⚠️ | ❌ | ❌ | ✅ |
| grep_search | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| npm scripts | ❌ | ❌ | ⚠️ | ⚠️ | ❌ | ✅ |
| test_failure | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

**Leyenda**: ✅ Permitido | ❌ Prohibido | ⚠️ Con supervisión

---

## 🎓 Especialidades y Herramientas Por Agente

### Backend Developer
```
Tecnologías: NestJS 10, TypeScript 5, Passport, JWT
Patrones: Services, Controllers, Guards, Middlewares
Validación: class-validator, class-transformer
Documentación: Swagger/OpenAPI
Herramientas: grep_search, semantic_search
```

### Database Specialist
```
Tecnologías: Prisma 5, PostgreSQL 15, PrismaStudio
Patrones: Models, Relations, Migrations, Indexes
Validación: Constraints, Foreign Keys, Unique fields
Herramientas: schema.prisma, prisma CLI, MCP Supabase
```

### Testing Engineer
```
Tecnologías: Jest 29, Supertest, ts-jest
Patrones: E2E tests, Unit tests, Fixtures, Mocks
Validación: Coverage, Error cases, Integration
Herramientas: test utils, jest-e2e.config.js
```

### API Architect
```
Tecnologías: OpenAPI 3.0, REST patterns, HTTP status codes
Patrones: Resource design, Error handling, Pagination
Validación: Consistency, Backwards compatibility
Documentación: api_contracts.md, Postman collections
```

### DevOps Engineer
```
Tecnologías: Docker, Docker Compose, Bash, npm
Patrones: Multi-stage builds, Health checks, Volumes
Configuración: env files, healthchecks, networking
Documentación: setup guides, troubleshooting
```

---

## 🚀 Flujos de Ejemplo

### Flujo 1: Implementar Nuevo Endpoint

```
1. API Architect
   → Define nuevo endpoint en api_contracts.md
   → Crea ejemplos request/response

2. Database Specialist
   → Valida que BD soporta los datos
   → Optimiza queries si es necesario

3. Backend Developer
   → Implementa Controller + Service
   → Usa respuestas de API contract
   → Inyecta DbService correctamente

4. Testing Engineer
   → Crea test cases (éxito + errores)
   → Valida respuestas con ejemplos

5. Project Director
   → Verifica integridad total
   → Confirma implementación en todos lados
   → Reporta completado
```

### Flujo 2: Optimizar Queries de BD

```
1. Testing Engineer
   → Reporta endpoint lento en tests

2. Database Specialist
   → Analiza query con EXPLAIN PLAN
   → Propone índices o relaciones
   → Crea migración Prisma

3. Backend Developer
   → Actualiza Repository con query optimizada
   → Verifica cambios no rompen servicios

4. Testing Engineer
   → Re-ejecuta tests para confirmar performance

5. Project Director
   → Verifica migración + código allineados
   → Reporta mejora
```

### Flujo 3: Cambio de Especificación

```
1. Project Director
   → Recibe nuevo requerimiento
   → Analiza impacto en arquitectura
   → Planifica cambios secuenciales

2. API Architect
   → Actualiza contracts
   → Valida breaking changes

3. Database Specialist
   → Actualiza schema si es necesario
   → Crea migraciones versionadas

4. Backend Developer
   → Actualiza implementación
   → Mantiene compatibilidad backward (si aplica)

5. Testing Engineer
   → Actualiza tests
   → Valida cobertura

6. DevOps Engineer
   → Actualiza env variables si necesario

7. Project Director
   → Verifica consistencia total
   → Reporta completado y riesgos residuales
```

---

## 📋 Verificación de Integridad

### Checklist Pre-Merge

- [ ] Backend Dev: Todos los imports resueltos
- [ ] Database Spec: Migraciones verificadas
- [ ] Testing Eng: Cobertura > 80%
- [ ] API Arch: Documentación actualizada
- [ ] DevOps Eng: .env.example completado
- [ ] Project Dir: Sin breaking changes no documentados
- [ ] Project Dir: Riesgos identificados y mitigados

### Checklist Pre-Deploy

- [ ] Testing Eng: Tests E2E pasando
- [ ] Database Spec: Migraciones probadas
- [ ] DevOps Eng: Configuración actualizada
- [ ] API Arch: OpenAPI válido
- [ ] Project Dir: Cambios documentados en CHANGELOG

---

## 🔗 Referencias

- Architecture: [architecture_nest.md](../Docs/E4/architecture_nest.md)
- Database Model: [db_model.md](../Docs/E4/db_model.md)
- API Contracts: [api_contracts.md](../Docs/E4/api_contracts.md)
- Prisma Schema: [schema.prisma](./prisma/schema.prisma)
- Testing Guide: [E2E_TESTING_GUIDE.md](./E2E_TESTING_GUIDE.md)

---

## 📞 Soporte y Escalación

**Project Director**: Contacto principal para decisiones de arquitectura
**Backend Developer**: Cuestiones de implementación NestJS
**Database Specialist**: Cuestiones de BD y performance
**Testing Engineer**: Cuestiones de coverage y test design
**API Architect**: Cuestiones de contratos y documentación
**DevOps Engineer**: Cuestiones de setup y deployment

**Escalación**: Si dos agentes no están de acuerdo, Project Director toma decisión.

---

**Última actualización**: 8 de abril de 2026
**Versión**: 1.0
