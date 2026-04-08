# 🤖 Arquitectura de Agentes - Restaurants Backend

## 📖 Introducción

Esta carpeta contiene la configuración de **1 Meta Agente (Project Director)** y **5 Subagentes Especializados** para orquestar el desarrollo del backend de restaurantes.

```
Project Director (Meta Agente)
├── Backend Developer ..................... Implementación NestJS/TypeScript
├── Database Specialist ................... Prisma/PostgreSQL/Migraciones
├── Testing Engineer ...................... Jest/E2E/Cobertura
├── API Architect ......................... Contratos REST/Swagger
└── DevOps Engineer ....................... Docker/Setup/Deployment
```

---

## 🎯 Cómo Usar Esta Arquitectura

### Para el Project Director

El **Project Director** es el meta agente principal responsable de:
- Orquestar tareas entre subagentes
- Verificar integridad arquitectónica
- Resolver conflictos
- Reportar progreso del proyecto

**Invocación**:
```
"Hola, soy el Project Director. Necesito implementar [feature X].
Por favor coordina entre los agentes."
```

**Responsabilidades**:
1. Recibir requerimiento
2. Analizar dependencias con subagentes
3. Planificar ejecución secuencial
4. Verificar completitud
5. Reportar riesgos

---

### Para el Backend Developer

El **Backend Developer** es especialista en implementación NestJS.

**Archivo**: `.github/agents/backend-developer.agent.md`

**Cuándo invocar**:
- "Necesito implementar el módulo de Restaurants"
- "Crea los servicios y controladores para [dominio]"
- "Agrega validaciones a los DTOs"

**Responsabilidades**:
- Módulos, servicios, controladores
- DTOs con validadores
- Guards y middlewares
- Decoradores Swagger
- Manejo de errores

**Requiere de**:
- API Architect: Especificación en api_contracts.md
- Database Specialist: Schema Prisma disponible
- Testing Engineer: Tests después

---

### Para el Database Specialist

El **Database Specialist** gestiona el schema Prisma y migraciones.

**Archivo**: `.github/agents/database-specialist.agent.md`

**Cuándo invocar**:
- "Necesito agregar un modelo Prisma para [entidad]"
- "Crea migraciones versionadas para estos cambios"
- "Optimiza las queries de [endpoint]"

**Responsabilidades**:
- Modelos Prisma
- Relaciones y constraints
- Migraciones versionadas
- Índices estratégicos
- Integridad referencial

**Requiere de**:
- Backend Developer: DTOs y servicios
- Testing Engineer: Tests de integridad
- Project Director: Decisiones críticas

**MCP Supabase**: Si disponible, puede ejecutar queries directas en BD

---

### Para el Testing Engineer

El **Testing Engineer** diseña y mantiene suites E2E.

**Archivo**: `.github/agents/testing-engineer.agent.md`

**Cuándo invocar**:
- "Crea tests E2E para el módulo de Restaurants"
- "Necesito cobertura > 80% del código"
- "Agrega casos de error para este endpoint"

**Responsabilidades**:
- Tests E2E con Supertest
- Test utilities y helpers
- Coverage analysis
- Setup/cleanup de datos
- Casos exitosos y error

**Requiere de**:
- Backend Developer: Endpoints implementados
- Database Specialist: BD estable
- Project Director: Cobertura goals

---

### Para el API Architect

El **API Architect** diseña y documenta contratos REST.

**Archivo**: `.github/agents/api-architect.agent.md`

**Cuándo invocar**:
- "Define el contrato REST para [dominio]"
- "Actualiza la documentación Swagger"
- "Crea la colección Postman"

**Responsabilidades**:
- Especificaciones REST
- OpenAPI/Swagger docs
- Respuestas estándar
- Códigos de error
- Ejemplos y colecciones

**Requiere de**:
- Backend Developer: Implementación
- Database Specialist: Datos reales
- Testing Engineer: Validación

---

### Para el DevOps Engineer

El **DevOps Engineer** configura Docker y automatización.

**Archivo**: `.github/agents/devops-engineer.agent.md`

**Cuándo invocar**:
- "Crea el Dockerfile para NestJS"
- "Configura docker-compose con PostgreSQL"
- "Automatiza el setup local"

**Responsabilidades**:
- Dockerfile multi-stage
- Docker Compose
- Variables de entorno
- npm scripts
- Documentación setup

**Requiere de**:
- Backend Developer: Dependencias
- Database Specialist: Migraciones
- Project Director: Infraestructura decisions

---

## 🔄 Flujos de Trabajo Típicos

### Flujo 1: Implementar Nuevo Endpoint Completo

```
1. Project Director
   "Necesito implementar GET /restaurants/:id"
   
2. API Architect
   → Define contrato en api_contracts.md
   → Crea ejemplos request/response
   
3. Database Specialist
   → Valida que modelo Restaurant existe
   → Optimiza queries si es necesario
   
4. Backend Developer
   → Implementa controller y service
   → Agrega validaciones y error handling
   
5. Testing Engineer
   → Crea tests E2E (éxito + errores)
   → Valida cobertura
   
6. Project Director
   "✅ Completado y verificado"
```

### Flujo 2: Optimizar Performance

```
1. Project Director
   "El endpoint GET /restaurants es lento"
   
2. Testing Engineer
   → Reporta tiempo de respuesta
   
3. Database Specialist
   → EXPLAIN PLAN la query
   → Crea índices
   → Propone cambios schema
   
4. Backend Developer
   → Actualiza repository si cambios BD
   
5. Testing Engineer
   → Re-ejecuta tests de performance
   
6. Project Director
   "✅ Optimization completada"
```

### Flujo 3: Breaking Change en API

```
1. Project Director
   "Necesitamos cambiar estructura de respuesta"
   
2. API Architect
   → Evalúa impact
   → Planifica versionamiento (/v1/ vs /v2/)
   → Actualiza contratos
   
3. Backend Developer
   → Implementa cambios (puede ser nuevo endpoint)
   
4. Testing Engineer
   → Tests para ambas versiones
   
5. DevOps Engineer
   → Actualiza documentación deployment
   
6. Project Director
   "✅ Versionamiento completado"
```

---

## 📋 Checklist: Cómo Invocar Agentes

### Si quieres que Backend Developer implemente algo:

- [ ] Especificación clara en api_contracts.md
- [ ] Database schema disponible
- [ ] DTOs o interfaces definidas
- [ ] Ejemplos de request/response

### Si quieres que Database Specialist agregue modelo:

- [ ] Análisis de relaciones completo
- [ ] Validación de integridad referencial
- [ ] Índices planeados
- [ ] Backend Developer notificado

### Si quieres que Testing Engineer agregue tests:

- [ ] Endpoints implementados y funcionales
- [ ] DTOs con validadores
- [ ] API contract disponible
- [ ] Setup/cleanup claro

### Si quieres que API Architect documente:

- [ ] Endpoints implementados
- [ ] Respuestas reales del API
- [ ] Códigos de error usados
- [ ] Ejemplos funcionales

### Si quieres que DevOps Engineer configure:

- [ ] package.json con dependencias
- [ ] Dockerfile requerimientos
- [ ] Variables de entorno necesarias
- [ ] servicios a orquestar (app, BD, etc)

---

## 🔧 Configuración Rápida

Si eres nuevo en el proyecto:

```bash
# 1. Lee el AGENTS.md principal
less AGENTS.md

# 2. Lee el agent que te corresponde
less backend-developer.agent.md      # Si eres Backend Dev
less database-specialist.agent.md    # Si trabajas BD
less testing-engineer.agent.md       # Si escribes tests
less api-architect.agent.md          # Si diseñas API
less devops-engineer.agent.md        # Si configuras infra

# 3. Consulta y coordina con otros agentes
# Ejemplo: Project Director te dice qué hacer
# Tú ejecutas tu rol
# Notificas a otros agentes cuando terminas
```

---

## 📞 Cómo Coordinarse

### Comunicación Interfase Agentes

```
Backend Developer → Database Specialist:
"¿Existe el modelo Restaurant? ¿Con qué relaciones?"

Database Specialist → Backend Developer:
"Sí, existe con relaciones a Location, Category, Order.
Aquí está el Prisma model."

Testing Engineer → Backend Developer:
"¿Los servicios están listos? Necesito endpoints
para escribir tests."

Backend Developer → Testing Engineer:
"Listos en [date/commit]. Aquí está documentación."

Project Director → Todos:
"Verifiquen que no hay conflictos. ¿Listo para merge?"

Todos → Project Director:
"✅ Completado y verificado"
```

### Escalación de Conflictos

Si dos agentes no se ponen de acuerdo:

```
Backend Developer: "Agregamos un servicio compartido"
Database Specialist: "No, es mejor una tabla intermedia"

→ Project Director arbitraje → "Vamos con tabla intermedia"
→ Todos aceptan y proceden
```

---

## 🎯 Mapa Rápido de Archivos

```
.github/agents/
├── README.md                          ← TÚ ESTÁS AQUÍ
├── backend-developer.agent.md         NestJS implementation
├── database-specialist.agent.md       Prisma & PostgreSQL
├── testing-engineer.agent.md          Jest & E2E tests
├── api-architect.agent.md             REST & Swagger
├── devops-engineer.agent.md           Docker & Setup
└── ..

Documentos relacionados:
├── AGENTS.md                          Arquitectura
├── Docs/E4/
│   ├── db_model.md                   SQL schema (11 entities)
│   ├── api_contracts.md              REST specs (50+ endpoints)
│   └── architecture_nest.md           NestJS patterns
├── prisma/
│   └── schema.prisma                 Prisma schema
├── test/
│   ├── restaurants.e2e-spec.ts       Restaurants tests (620 líneas)
│   ├── reservations.e2e-spec.ts      Reservations tests (550 líneas)
│   ├── test-utils.ts                 Test helpers (450 líneas)
│   └── jest-e2e.config.js            Jest configuration
├── Dockerfile                         Docker image
├── docker-compose.yml               Docker services
├── .env.example                      Environment template
└── E2E_TESTING_GUIDE.md              Testing documentation
```

---

## ✅ Verificación: ¿Estoy Listo?

### Checklist para cualquier agente:

- [ ] Leí el archivo [agent-name].agent.md
- [ ] Entiendo mi rol y responsabilidades
- [ ] Sé cuáles herramientas puedo usar
- [ ] Sé a quiénes contactar para dependencias
- [ ] Entiendo los riesgos de mi dominio
- [ ] Puedo ejecutar mi checklist pre-completación

---

## 🚀 Ejemplo de Uso Real

```
Usuario: "Project Director, implementar el módulo de Reservations"

Project Director:
"Entendido. Necesito coordinar:
1. API Architect: Especificar contratos (GET, POST, PUT, DELETE)
2. Database Specialist: Modelo Reservation ya existe, validar relaciones
3. Backend Developer: Implementar módulo (controller + service)
4. Testing Engineer: Tests E2E para este módulo
5. DevOps Engineer: Actualizar docker-compose si necesario

¿Comenzamos?"

API Architect:
"✅ Contratos listos. Ver api_contracts.md secciones:
- POST /reservations (create)
- GET /reservations (list)
- GET /reservations/:id (get)
- PUT /reservations/:id (update)
- DELETE /reservations/:id (cancel)"

Database Specialist:
"✅ Schema validado. Modelo Reservation existe con relaciones
a User, Table, Restaurant. Migraciones listas."

Backend Developer:
"Working... Implementando módulos, servicios, controladores..."

Backend Developer:
"✅ Módulo Reservations implementado. Controlador con todos
los endpoints, servicios con lógica, DTOs con validadores."

Testing Engineer:
"Working... Escribiendo E2E tests..."

Testing Engineer:
"✅ Tests completados. 35+ test cases, cobertura 92%."

Project Director:
"✅ COMPLETADO. Módulo Reservations integrado:
- ✅ API spec actualizada
- ✅ Modelos Prisma validados
- ✅ Código implementado NestJS
- ✅ Tests > 80% cobertura
- ✅ Sin breaking changes

Status: READY TO MERGE"
```

---

## 📚 Recursos Adicionales

- **Main Architecture**: [AGENTS.md](../AGENTS.md)
- **Database Model**: [db_model.md](../../Docs/E4/db_model.md)
- **API Contracts**: [api_contracts.md](../../Docs/E4/api_contracts.md)
- **NestJS Patterns**: [architecture_nest.md](../../Docs/E4/architecture_nest.md)
- **Testing Guide**: [E2E_TESTING_GUIDE.md](../../E2E_TESTING_GUIDE.md)
- **Postman Setup**: [POSTMAN_README.md](../../POSTMAN_README.md)

---

## 🤝 F.A.Q.

**P: ¿Puedo trabajar en múltiples tareas como un agente?**
R: Sí, pero coordina con Project Director para evitar conflictos.

**P: ¿Qué pasa si necesito cambiar algo de otro dominio?**
R: Comunica al agente responsable. Ellos validan y hacen el cambio.

**P: ¿Cuál es el máximo parallelismo?**
R: Backend Dev, Testing Eng, Database Spec pueden trabajar en paralelo si no hay dependencias.

**P: ¿Qué pasa si hay conflicto entre agentes?**
R: Project Director arbitra. Su decisión es final.

**P: ¿Puedo saltarme el checklist pre-completación?**
R: No. El checklist es obligatorio antes de reportar "listo".

---

## 📞 Soporte

Si tienes dudas sobre:
- **NestJS**: Pregunta al Backend Developer
- **BD**: Pregunta al Database Specialist
- **Testing**: Pregunta al Testing Engineer
- **API Design**: Pregunta al API Architect
- **Docker Setup**: Pregunta al DevOps Engineer
- **Decisiones Mayores**: Pregunta al Project Director

---

**Última visualización**: Abril 8, 2026
**Versión**: 1.0
**Autor**: Project Director
