# 🚀 Guía Completa: Deployment en Easypanel

**Última actualización**: 11 de abril de 2026 | **Versión**: v0.3.0

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Pre-Requisitos](#pre-requisitos)
3. [Preparación del Proyecto](#preparación-del-proyecto)
4. [Configuración en Easypanel](#configuración-en-easypanel)
5. [Variables de Entorno](#variables-de-entorno)
6. [Verificación Post-Deploy](#verificación-post-deploy)
7. [Troubleshooting](#troubleshooting)
8. [Rollback y Recuperación](#rollback-y-recuperación)

---

## 🎯 Visión General

Este documento describe el proceso completo para desplegar el backend de Restaurants en **Easypanel**, una plataforma de deployment basada en Docker.

### **Arquitectura del Deployment**

```
┌──────────────────────────────────────────────┐
│         Easypanel (Hosting Platform)          │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────┐  ┌──────────────────┐ │
│  │  Express Server  │  │ PostgreSQL 15    │ │
│  │  (Port 3000)     │  │ (Port 5432)      │ │
│  │                  │  │                  │ │
│  │ Node.js + Prisma │  │ Persistent Data  │ │
│  └──────────────────┘  └──────────────────┘ │
│         ↓                      ↓              │
│  ┌─────────────────────────────────────────┐ │
│  │        Docker Container Network        │ │
│  └─────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
         ↓
    Your Domain (example.com)
```

### **Características del Deployment**

- ✅ **Servidor Express** completamente funcional
- ✅ **PostgreSQL 15** containerizado
- ✅ **Prisma ORM** sincronizado con BD
- ✅ **Seed data** preconfigurado
- ✅ **6 endpoints REST** probados
- ✅ **Health checks** integrados
- ✅ **Persistencia de datos** garantizada
- ✅ **CORS configurado** para producción

---

## 📋 Pre-Requisitos

### **Antes de Iniciar**

Asegúrate de tener:

- [ ] Cuenta activa en Easypanel
- [ ] Acceso a tu panel de Easypanel (detalles en email de bienvenida)
- [ ] Credenciales de GitHub guardadas (si usas Git integration)
- [ ] Este repositorio forkeado o accesible
- [ ] Conocimiento básico de Docker (opcional pero útil)

### **Información que Necesitarás**

- **Database URL**: Será generada por Easypanel
- **JWT Secret**: Cambiar antes de producción
- **CORS Origin**: Tu dominio en producción
- **NODE_ENV**: `production`
- **Puerto**: El que asigne Easypanel (típicamente 3000)

---

## 🔧 Preparación del Proyecto

### **1. Verificar Que Todo Está Listo**

```bash
# Desde la raíz del proyecto
# Verificar estructura de archivos
ls -la docker-compose.prod.yml    # ✅ Debe existir
ls -la .env.prod.example           # ✅ Debe existir
ls -la Dockerfile                  # ✅ Debe existir
ls -la dev-server.js               # ✅ Debe existir

# Verificar que funciona localmente
npm install
npm run db:setup                  # Sincroniza BD y carga datos
node dev-server.js               # Arranca servidor
curl http://localhost:3000/api   # Debe responder
```

### **2. Actualizar Variables de Entorno**

**Crear `.env.prod` basado en `.env.prod.example`:**

```bash
# Copiar el archivo de ejemplo
cp .env.prod.example .env.prod

# Editar con valores de producción
nano .env.prod  # o tu editor preferido
```

**Variables críticas a actualizar:**

```env
# ⚠️ CAMBIOS REQUERIDOS PARA PRODUCCIÓN

# 1. NODE_ENV
NODE_ENV=production

# 2. CORS_ORIGIN (tu dominio en Easypanel)
CORS_ORIGIN=https://api.tu-dominio.com

# 3. JWT_SECRET (generar nuevo seguro)
# NUNCA usar el valor de ejemplo
JWT_SECRET=$(openssl rand -base64 32)

# 4. JWT_REFRESH_SECRET
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# 5. PORT (dejar como 3000 - Easypanel lo mapea)
PORT=3000

# 6. DATABASE_URL
# Será proporcionado por Easypanel después de crear BD
# Formato: postgresql://user:password@host:port/database
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]

# 7. MAIL_* (opcional pero recomendado)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
```

### **3. Verificar Dockerfile**

El proyecto incluye un `Dockerfile` optimizado:

```dockerfile
# Estructura esperada:
FROM node:20-alpine          # Multi-stage build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npx prisma generate
CMD ["node", "dev-server.js"]
EXPOSE 3000
HEALTHCHECK ...
```

✅ El Dockerfile ya está configurado. No necesita cambios.

### **4. Preparar el Repositorio Git**

Si usarás GitHub deployment (recomendado):

```bash
# Asegurar que está en Git
git status

# Si no está inicializado:
git init
git remote add origin https://github.com/tu-usuario/restaurants-backend.git

# Push a la rama principal
git add .
git commit -m "chore: prepare for easypanel deployment"
git push origin main
```

---

## 🐳 Configuración en Easypanel

### **Opción A: Deployment desde GitHub (Recomendado)**

#### **Paso 1: Conectar GitHub**

1. Ve a **Easypanel Dashboard** → **Settings**
2. Click en **Connect GitHub** (o **Integrations**)
3. Autoriza Easypanel en tu cuenta GitHub
4. Selecciona el repositorio `restaurants-backend`

#### **Paso 2: Crear Nueva Aplicación**

1. Click en **+ Add Service** o **Create App**
2. Selecciona **GitHub** como origen
3. Configura:
   - **Repository**: `tu-usuario/restaurants-backend`
   - **Branch**: `main`
   - **Dockerfile Path**: `./Dockerfile`
   - **Build Context**: `.` (root)

#### **Paso 3: Configuración de Runtime**

1. **Name**: `restaurants-api`
2. **Port**: `3000`
3. **Health Check**: `GET /api/db-status` (endpoint que verifica BD)
4. **Restart Policy**: `unless-stopped`

#### **Paso 4: Variables de Entorno**

1. Click en **Environment Variables**
2. Agregar variables (copiar desde `.env.prod`):

```
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://tu-dominio.com
JWT_SECRET=<generar-nuevo>
JWT_REFRESH_SECRET=<generar-nuevo>
DATABASE_URL=postgresql://...
LOG_LEVEL=info
```

⚠️ **NO** incluir secretos en `.env.example`. Easypanel tiene variables secretas.

---

### **Opción B: Deployment Manual (Git Pull)**

Si Easypanel no tiene integración GitHub directa:

#### **Paso 1: Conectar Repository**

1. En Easypanel, crear app con **Git URL**
2. Proporcionar URL del repositorio
3. Easypanel hará pull automático

#### **Paso 2: Configurar Build & Deploy**

1. Seleccionar **Dockerfile Build**
2. Build Command: `docker build -t restaurants-api .`
3. Start Command: `node dev-server.js`

---

## 🗄️ Configuración de Base de Datos

### **En Easypanel**

#### **Opción 1: BD Gestionada por Easypanel (Recomendado)**

1. Click en **+ Add Service** → **PostgreSQL**
2. Configurar:
   - **Version**: `15-alpine`
   - **Database Name**: `restaurants_prod`
   - **Username**: `restaurants_user`
   - **Password**: Generar automático (guardar)

3. Easypanel proporcionará:
   - `DATABASE_URL=postgresql://...`
   - Copiar a las variables de entorno de la app

#### **Opción 2: BD Externa**

Si ya tienes PostgreSQL en otro lugar:

1. Obtener `DATABASE_URL` completo
2. Agregar a variables de entorno
3. Asegurar que Easypanel puede conectar (firewall, IP whitelist)

### **Setup de Datos (Seed)**

Después de que BD esté lista:

```bash
# En la terminal de Easypanel o SSH:
npm run db:setup

# Esto ejecutará:
# 1. prisma db push (sincroniza schema)
# 2. node prisma/seed.js (carga datos iniciales)

# Verificar:
curl https://tu-dominio.com/api/db-status
```

---

## 🔐 Variables de Entorno

### **Lista Completa de Variables**

```env
# === OBLIGATORIAS ===

# Entorno
NODE_ENV=production
PORT=3000

# Base de Datos
DATABASE_URL=postgresql://restaurants_user:PASSWORD@HOST:5432/restaurants_prod

# JWT (Generar nuevos valores)
JWT_SECRET=<generar-con-openssl-rand-base64-32>
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=<generar-con-openssl-rand-base64-32>
JWT_REFRESH_EXPIRATION=7d

# === RECOMENDADAS ===

# CORS
CORS_ORIGIN=https://tu-dominio.com

# Logging
LOG_LEVEL=info

# App Info
APP_NAME=Restaurants API
APP_VERSION=1.0.0

# === OPCIONALES ===

# Email (si usas)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Redis (para caching futuro)
REDIS_HOST=
REDIS_PORT=6379

# S3 (para uploads futuro)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
```

### **Como Generar Secretos Seguros**

```bash
# En tu máquina local:
openssl rand -base64 32

# Resultado ejemplo:
# aBcD1e2fGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMn==

# Copiar a Easypanel como JWT_SECRET
```

---

## ✅ Verificación Post-Deploy

### **1. Healthcheck Básico**

```bash
# Endpoint de health
curl https://tu-dominio.com/api/db-status

# Respuesta esperada:
{
  "status": "CONNECTED",
  "message": "Database connection successful",
  "restaurantCount": 3,
  "database": "PostgreSQL",
  "timestamp": "2026-04-11T..."
}
```

### **2. Verificar Endpoints Principales**

```bash
# Obtener restaurantes
curl https://tu-dominio.com/api/restaurants

# Debe devolver JSON con 3 restaurantes (si seed funcionó)

# Crear restaurante (POST)
curl -X POST https://tu-dominio.com/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Restaurant",
    "description": "Testing deployment",
    "cuisineType": "International"
  }'
```

### **3. Verificar Logs**

En Easypanel, revisar **Logs**:

```
✅ "Database connection successful"
✅ "Servidor corriendo en:"
✅ "Base de datos conectada correctamente"
❌ Buscar errores en logs
```

### **4. Monitoreo en Tiempo Real**

Easypanel proporciona:
- CPU Usage
- Memory Usage
- Network Traffic
- Request Count
- Error Rate

Verificar que todo esté en verde. 🟢

---

## 🐛 Troubleshooting

### **Problema: "Connection refused" al BD**

**Síntomas**:
```
{"status":"ERROR","message":"Failed to connect to database"}
```

**Solución**:
1. Verificar `DATABASE_URL` en variables de entorno
2. Asegurar que BD está corriendo en Easypanel
3. Verificar credenciales (usuario, contraseña)
4. Revisar firewall/security groups

**Diagnostic**:
```bash
# En terminal de Easypanel
psql $DATABASE_URL -c "SELECT 1;"
```

---

### **Problema: "Container exits immediately"**

**Síntomas**:
- App se reinicia cada 5 segundos
- Logs vacíos o truncados

**Soluciones**:
1. Revisar si hay error en `npm install`:
   ```bash
   npm ci --production
   ```

2. Verificar Prisma generation:
   ```bash
   npx prisma generate
   ```

3. Ver logs completos:
   - Easypanel → Logs → Last 100 lines

---

### **Problema: "Seed data no se cargó"**

**Síntomas**:
- `/api/db-status` devuelve `"restaurantCount": 0`

**Solución**:
1. SSH a la app en Easypanel o ejecutar comando:
   ```bash
   npm run db:seed
   ```

2. Verificar que BD está sincronizada:
   ```bash
   npx prisma db push --force-reset
   npm run db:seed
   ```

3. Verificar logs:
   ```
   ✅ Creating user: Marco
   ✅ Creating restaurant: Bella Italia
   ```

---

### **Problema: "CORS error"**

**Síntomas**:
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solución**:
1. Actualizar `CORS_ORIGIN` en variables de entorno
2. Incluir protocolo completo: `https://tu-dominio.com`
3. NO incluir trailing slash: `❌ https://tu-dominio.com/`

```env
CORS_ORIGIN=https://api.tu-dominio.com
```

4. Reiniciar app (redeploy)

---

### **Problema: "High memory usage"**

**Síntomas**:
- Memoria crece continuamente
- App se reinicia por OOM

**Soluciones**:
1. Revisar queries de Prisma (posible N+1 problem)
2. Agregar memlimit en Docker:
   ```
   Memory Limit: 512MB
   Swap: 256MB
   ```

3. Aumentar node version si es muy viejo:
   - Dockerfile usa `node:20-alpine` ✅

---

## 🔄 Rollback y Recuperación

### **Rollback a Versión Anterior**

En Easypanel:

1. **Deployments** → Ver historial
2. Click en versión anterior
3. **Redeploy** o **Rollback**
4. Confirmar

El sistema automáticamente restaura:
- Imagen Docker anterior
- Variables de entorno previas
- BD mantiene datos (no se pierde información)

---

### **Backup de BD**

**Si usas BD gestionada de Easypanel:**

1. **Database** → **Backups**
2. Click **Create Backup**
3. Easypanel automáticamente hace backups diarios

**Para backup manual:**
```bash
# En terminal de Easypanel
pg_dump $DATABASE_URL > backup.sql
```

---

### **Recuperación Rápida**

Si algo sale mal:

1. **Stop App** → Frenarlo
2. **Deploy Previous Version** → Rollback automático
3. **Verify Health Check** → Asegurar que funciona
4. **Monitor Logs** → Buscar errores
5. **Contact Easypanel Support** → Si persiste error

---

## 📊 Monitoreo y Mantenimiento

### **Cosas a Revisar Regularmente**

**Diario** ⏰:
- [ ] Health check passing
- [ ] No errors en logs
- [ ] API respondiendo

**Semanal** 📅:
- [ ] Memory/CPU usage normal
- [ ] Database size check
- [ ] Request count trends

**Mensual** 📊:
- [ ] Security updates disponibles
- [ ] Backups completados
- [ ] Performance metrics

### **Alertas a Configurar**

En Easypanel → **Alerts**:
- [ ] High Memory Usage (>80%)
- [ ] High CPU Usage (>80%)
- [ ] Health Check Failing
- [ ] Deployment Failed
- [ ] Database Connection Lost

---

## 🔗 Referencias Rápidas

| Recurso | Link |
|---------|------|
| Swagger API Docs | `https://tu-dominio.com/api` |
| Database Status | `GET https://tu-dominio.com/api/db-status` |
| Todos los endpoints | Ver [api_contracts.md](./Docs/E4/api_contracts.md) |
| Documentación BD | Ver [db_model.md](./Docs/E4/db_model.md) |
| Docker Info | Ver [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md) |
| Variables de entorno | Ver [.env.prod.example](./.env.prod.example) |

---

## 📞 Soporte

### **Si Encuentras Problemas**

1. **Revisar logs** en Easypanel Dashboard
2. **Buscar en Troubleshooting** arriba ⬆️
3. **Verificar DATABASE_URL** y secretos
4. **Simular localmente** con `.env.prod`
5. **Contactar** al equipo/Easypanel Support

### **Información Útil para Reportar Issues**

```
- Error exacto (copiar del log)
- Timestamp del error
- Última acción realizada
- Resultado de health check
- Base de datos accesible? (sí/no)
```

---

## ✨ Próximos Pasos Después del Deploy

### **Post-Production**

1. **Configurar dominio** (CNAME/A record)
2. **SSL/HTTPS** (Easypanel maneja Let's Encrypt)
3. **Alertas y monitoreo** (ver sección arriba)
4. **Documentar accesos** y credenciales
5. **Plan de mantenimiento** (backups, updates)

### **Frontend**

Si tienes frontend (React, Vue, etc.):
```javascript
// Actualizar API_URL
const API_URL = "https://tu-dominio.com/api";
```

### **Scaling Futuro**

Si crece mucho:
- Easypanel permite horizontal scaling
- Multi-instancia con load balancer
- Read replicas de BD
- Redis caching

---

**¡Felicidades! Tu backend está listo para producción.** 🎉

Para preguntas específicas de Easypanel, revisar su [documentación oficial](https://docs.easypanel.io/).

---

**Última revisión**: 11 de abril de 2026
**Estado**: ✅ Production Ready
**Versión**: v0.3.0
