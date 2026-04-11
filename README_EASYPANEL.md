# 🚀 Restaurants Backend - Easypanel Deployment Guide

**Status**: ✅ Production Ready  
**Version**: v0.3.0  
**Last Updated**: 11 de abril de 2026  

---

## 🎯 Quick Start (5 minutos)

### **Paso 1: Preparar Proyecto (2 min)**

En tu máquina local:

```bash
# Opción A: Windows PowerShell
powershell -ExecutionPolicy Bypass -File easy-deploy.ps1

# Opción B: Linux/Mac Bash
chmod +x easy-deploy.sh
./easy-deploy.sh

# Opción C: Manual
cp .env.prod.example .env.prod
# Editar .env.prod con:
#   - CORS_ORIGIN: tu dominio
#   - DATABASE_URL: de Easypanel (después)
```

El script:
- ✅ Genera JWT_SECRET y JWT_REFRESH_SECRET seguros
- ✅ Crea .env.prod
- ✅ Verifica archivos necesarios
- ✅ Actualiza .gitignore

### **Paso 2: Pushear a GitHub (1 min)**

```bash
git add .
git commit -m "chore: prepare for easypanel deployment"
git push origin main
```

### **Paso 3: Deploy en Easypanel (2 min)**

En el dashboard de Easypanel:

1. **Crear Aplicación**
   - Connect GitHub
   - Selecciona: `restaurants-backend`
   - Branch: `main`
   - Build: `Dockerfile`

2. **Agregar Variables de Entorno**
   ```
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=https://tu-dominio.com
   JWT_SECRET=<valor-de-.env.prod>
   JWT_REFRESH_SECRET=<valor-de-.env.prod>
   LOG_LEVEL=info
   ```

3. **Crear Base de Datos**
   - Type: PostgreSQL 15
   - Easypanel te dará: `DATABASE_URL`
   - Copiar a variables de entorno

4. **Deploy**
   - Health Check: `GET /api/db-status`
   - Restart: `unless-stopped`
   - Deploy

### **Paso 4: Verificar**

```bash
# Health check
curl https://tu-dominio.com/api/db-status

# Expected response:
{
  "status": "CONNECTED",
  "restaurantCount": 3,
  "database": "PostgreSQL"
}
```

---

## 📋 Documentación Completa

| Documento | Contenido |
|-----------|-----------|
| **[EASYPANEL_DEPLOYMENT.md](./EASYPANEL_DEPLOYMENT.md)** | Guía detallada 📖 |
| **[EASYPANEL_CHECKLIST.md](./EASYPANEL_CHECKLIST.md)** | Lista de verificación ✅ |
| **[.env.prod.example](./.env.prod.example)** | Variables de entorno 🔐 |
| **[docker-compose.prod.yml](./docker-compose.prod.yml)** | Configuración Docker 🐳 |
| **[Dockerfile](./Dockerfile)** | Multi-stage build 🔨 |

---

## 🔧 Configuración Crítica

### **Environment Variables Requeridas**

```env
NODE_ENV=production              # ✅ Requerido
PORT=3000                        # ✅ Requerido
DATABASE_URL=postgres://...      # ✅ Requerido (de Easypanel)
JWT_SECRET=<generar-nuevo>       # ✅ Requerido y ÚNICO
JWT_REFRESH_SECRET=<generar>     # ✅ Requerido y ÚNICO
CORS_ORIGIN=https://tu-dominio   # ✅ Requerido
LOG_LEVEL=info                   # ⚠️ Opcional (default: info)
```

⚠️ **CRÍTICO**: Nunca usar secretos de ejemplo en producción.

### **Health Check Endpoint**

```bash
GET /api/db-status

Response (200):
{
  "status": "CONNECTED",
  "message": "Database connection successful",
  "restaurantCount": 3,
  "database": "PostgreSQL (Docker)",
  "timestamp": "2026-04-11T..."
}
```

Easypanel usará este endpoint para:
- Verificar que la app está viva
- Detectar problemas de BD
- Auto-reiniciar si falla

---

## 🏗️ Arquitectura del Deployment

```
GitHub Repository
        ↓
    Easypanel CI/CD
        ↓
   Docker Build (Dockerfile)
        ↓
   Push to Registry
        ↓
   Deploy Container
        ↓
   Express Server (port 3000)
        ↓
   PostgreSQL 15 (managed)
        ↓
   Your Domain (https://...)
```

### **Componentes Incluidos**

- ✅ **Express Server**: API REST completamente funcional
- ✅ **Prisma ORM**: Conexión tipo-segura a BD
- ✅ **PostgreSQL 15**: Base de datos relacional
- ✅ **Health Checks**: Monitoreo automático
- ✅ **Seed Data**: 3 restaurantes, 3 usuarios, datos de prueba
- ✅ **Logging**: Trazabilidad en producción
- ✅ **CORS**: Seguridad cross-origin

---

## 🐛 Troubleshooting Rápido

### ❌ Build falla

```
→ Revisar logs de Docker build
→ `npm ci --production` debe funcionar
→ `npx prisma generate` debe ejecutarse
→ Verificar que package.json es válido
```

**Solución**:
```bash
npm ci --production
npx prisma generate
docker build -t test .
```

### ❌ Health check falla

```
→ Base de datos no conectada
→ DATABASE_URL incorrecta
→ Credenciales de BD erróneas
```

**Solución**:
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Test conectar a BD
psql $DATABASE_URL -c "SELECT 1;"
```

### ❌ API responde pero sin datos

```
→ Seed no ejecutado
```

**Solución en terminal de Easypanel**:
```bash
npm run db:setup
# O simplemente:
npm run db:seed
```

---

## 📊 Monitoreo

Easypanel te proporciona:

- **CPU/Memory**: Uso de recursos en tiempo real
- **Logs**: Últimas 1000 líneas de output
- **Network**: Tráfico entrante/saliente
- **Deployments**: Historial de cambios
- **Health**: Estado del health check

Monitorear regularmente:
- [ ] CPU < 30%
- [ ] Memory < 50%
- [ ] Health check: 200 OK
- [ ] Sin errores en logs

---

## 🔄 Updates y Rollback

### **Actualizar Código**

```bash
git commit -m "feature: new endpoint"
git push origin main

# Easypanel automáticamente:
# 1. Detecta push
# 2. Rebuilda imagen
# 3. Redeploya con cero downtime
```

### **Rollback a Versión Anterior**

En Easypanel Dashboard:
1. **Deployments** → Historial
2. Seleccionar versión anterior
3. Click **Rollback**
4. Automáticamente restaura código + BD intacta

---

## 📞 API Endpoints Disponibles

Después del deploy, estos endpoints estarán disponibles:

### **GET /api/restaurants**
```bash
curl https://tu-dominio.com/api/restaurants
# Response: Lista de 3 restaurantes
```

### **GET /api/db-status**
```bash
curl https://tu-dominio.com/api/db-status
# Response: {"status":"CONNECTED","restaurantCount":3}
```

### **GET /api**
```bash
curl https://tu-dominio.com/api
# Response: Info de API y endpoints
```

### **POST /api/restaurants**
```bash
curl -X POST https://tu-dominio.com/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Restaurant",
    "description": "Description",
    "cuisineType": "Italian"
  }'
# Response: 201 Created
```

Para más endpoints, ver [api_contracts.md](./Docs/E4/api_contracts.md)

---

## ✨ Post-Deploy Checklist

Una vez deployado:

- [ ] Health check respondiendo (verde)
- [ ] Logs sin errores
- [ ] CPU/Memory normal
- [ ] `/api/restaurants` devuelve 3 restaurantes
- [ ] `/api/db-status` muestra CONNECTED
- [ ] Domain configurado y funcionando
- [ ] SSL/HTTPS automático (Easypanel)

---

## 🎯 Próximos Pasos (Futuro)

Después del primer deploy:

1. **Agregar Frontend**
   - Update `CORS_ORIGIN` si es necesario
   - Frontend consume endpoints REST

2. **Optimizar Performance**
   - Agregar Redis caching
   - Indexar consultas frecuentes
   - Monitorear con Sentry/Datadog

3. **Escalar**
   - Aumentar recursos si crece
   - Horizontal scaling con Easypanel
   - Read replicas de BD

4. **Mantener**
   - Actualizar dependencias mensualmente
   - Backups automáticos de BD
   - Monitoreo de alertas

---

## 📚 Referencias

- **PostgreSQL Docs**: https://www.postgresql.org/docs/15/
- **Prisma Docs**: https://www.prisma.io/docs/
- **Easypanel Docs**: https://docs.easypanel.io/
- **Docker Docs**: https://docs.docker.com/
- **Express Docs**: https://expressjs.com/

---

## 🆘 ¿NECESITAS AYUDA?

### **Documentación Interna**
- [EASYPANEL_DEPLOYMENT.md](./EASYPANEL_DEPLOYMENT.md) - Guía detallada
- [EASYPANEL_CHECKLIST.md](./EASYPANEL_CHECKLIST.md) - Lista de verificación
- [Dockerfile](./Dockerfile) - Notas de build

### **Información de BD**
- [db_model.md](./Docs/E4/db_model.md) - Esquema de BD
- [API Contracts](./Docs/E4/api_contracts.md) - Endpoints disponibles
- [Architecture](./Docs/E4/architecture_nest.md) - Diseño del sistema

### **Easypanel Support**
- Documentation: https://docs.easypanel.io/
- Community: Discord/Forum
- Email: support@easypanel.io

---

## ✅ Estado Actual

```
✅ Servidor Express completamente funcional
✅ PostgreSQL sincronizado y poblado
✅ Dockerfile optimizado para producción
✅ Configuración de entorno lista
✅ Documentación completa
✅ Scripts de deployment automatizados
⏳ Ready para Easypanel (tu turno!)
```

---

**¿Listo para deployar? Comienza con `./easy-deploy.sh` o `easy-deploy.ps1` 🚀**

