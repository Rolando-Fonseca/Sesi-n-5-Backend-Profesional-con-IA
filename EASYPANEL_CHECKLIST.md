# 🚀 Pre-Deployment Checklist - Easypanel

**Status**: ✅ Ready for Deployment  
**Date**: 11 de abril de 2026  
**Version**: v0.3.0  

---

## ✅ PRE-DEPLOYMENT VERIFICATION CHECKLIST

### 🔍 **Configuración Local**

- [ ] Código funciona localmente
  ```bash
  npm install
  node dev-server.js
  # ✅ Server responde en http://localhost:3000
  ```

- [ ] Base de datos sincronizada
  ```bash
  npm run db:setup
  # ✅ Schema pushed y seed completado
  ```

- [ ] Endpoints principales testados
  ```bash
  curl http://localhost:3000/api/restaurants
  curl http://localhost:3000/api/db-status
  # ✅ Respuestas JSON correctas
  ```

- [ ] Git sincronizado
  ```bash
  git status
  git push origin main
  # ✅ Repositorio actualizado
  ```

---

### 🐳 **Archivos de Deployment Listos**

- [ ] `Dockerfile` creado y válido
  ```bash
  docker build -t restaurants-api:test .
  # ✅ Build sin errores
  ```

- [ ] `.env.prod.example` existe
  ```bash
  ls -la .env.prod.example
  # ✅ Archivo presente
  ```

- [ ] `docker-compose.prod.yml` existe
  ```bash
  ls -la docker-compose.prod.yml
  # ✅ Archivo presente
  ```

- [ ] `EASYPANEL_DEPLOYMENT.md` completo
  ```bash
  ls -la EASYPANEL_DEPLOYMENT.md
  # ✅ Documentación lista
  ```

---

### 🔐 **Secretos y Variables de Entorno**

- [ ] JWT SECRET generado (NO usar ejemplo)
  ```bash
  openssl rand -base64 32
  # ✅ Resultado guardado (no en Git)
  ```

- [ ] JWT REFRESH SECRET generado
  ```bash
  openssl rand -base64 32
  # ✅ Resultado guardado (no en Git)
  ```

- [ ] Database credentials seguros
  ```env
  DATABASE_URL=postgresql://user:securepass@host:5432/db
  # ✅ Verifica que contraseña tiene caracteres especiales
  ```

- [ ] CORS_ORIGIN configurado para producción
  ```env
  CORS_ORIGIN=https://tu-dominio.com
  # ✅ NO incluir trailing slash
  ```

- [ ] `.env.prod` NO está en Git
  ```bash
  git status
  # ✅ No debería aparecer .env.prod
  ```

---

### 📦 **Dependencias y Compilación**

- [ ] package.json actualizado
  ```bash
  npm install
  # ✅ Sin errores
  ```

- [ ] Prisma schema válido
  ```bash
  npx prisma validate
  # ✅ "Prisma schema is valid"
  ```

- [ ] Prisma client generado
  ```bash
  npx prisma generate
  # ✅ Sin errores
  ```

- [ ] Scripts de BD presentes en package.json
  ```json
  {
    "scripts": {
      "db:setup": "prisma db push && node prisma/seed.js",
      "db:seed": "node prisma/seed.js",
      "db:migrate": "prisma migrate dev",
      "db:migrate:prod": "prisma migrate deploy"
    }
  }
  ```
  - [ ] `db:setup` ✅
  - [ ] `db:seed` ✅
  - [ ] `db:migrate` ✅
  - [ ] `db:migrate:prod` ✅

---

### 🏗️ **Arquitectura**

- [ ] Servidor Express funcional
  - [ ] `dev-server.js` existe
  - [ ] 6 endpoints implementados
  - [ ] Health check endpoint disponible
  - [ ] CORS configurado
  - [ ] Prisma conectado

- [ ] Base de datos Prisma
  - [ ] `prisma/schema.prisma` válido
  - [ ] 11 modelos definidos
  - [ ] Todas las relaciones OK
  - [ ] Enums configurados

- [ ] Seed data
  - [ ] `prisma/seed.js` existe
  - [ ] 3 usuarios en seed
  - [ ] 3 restaurantes en seed
  - [ ] Datos de prueba listos

---

### 📋 **Configuración de Easypanel**

#### Antes de conectar GitHub:

- [ ] Crear .env.prod desde .env.prod.example
  ```bash
  cp .env.prod.example .env.prod
  # Editar con valores reales
  ```

- [ ] Verificar que Repository es público o Easypanel tiene acceso
  ```bash
  git remote -v
  # origin: https://github.com/tu-usuario/restaurants-backend.git
  ```

#### En Easypanel Dashboard:

- [ ] Conectar cuenta GitHub
- [ ] Seleccionar repositorio `restaurants-backend`
- [ ] Seleccionar rama `main`

- [ ] Configurar aplicación:
  - [ ] Name: `restaurants-api`
  - [ ] Port: `3000`
  - [ ] Health Check: `GET /api/db-status` ← CRÍTICO
  - [ ] Restart Policy: `unless-stopped`

- [ ] Agregar variables de entorno (desde .env.prod):
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
  - [ ] `CORS_ORIGIN=<tu-dominio>`
  - [ ] `JWT_SECRET=<valor-generado>`
  - [ ] `JWT_REFRESH_SECRET=<valor-generado>`
  - [ ] `DATABASE_URL=<de-easypanel-o-externa>`
  - [ ] `LOG_LEVEL=info`

- [ ] Configurar Base de Datos:
  - [ ] Opción A: Usar BD de Easypanel (recomendado)
    - [ ] Type: PostgreSQL 15
    - [ ] Database: `restaurants_prod`
    - [ ] Obtener DATABASE_URL y agregar a vars de entorno
  - [ ] Opción B: BD externa (si aplica)
    - [ ] Verificar firewall/security groups
    - [ ] Testar conexión: `psql $DATABASE_URL -c "SELECT 1;"`

---

### 🚀 **Deployment Inicial**

- [ ] Buildear imagen Docker localmente
  ```bash
  docker build -t restaurants-api:latest .
  # ✅ Sin errores
  ```

- [ ] Test de imagen localmente
  ```bash
  docker run -e NODE_ENV=production -p 3000:3000 restaurants-api:latest
  # ✅ Inicia sin errores
  ```

- [ ] Easypanel inicia deployment
  - [ ] Push a main branch o redeployar desde Dashboard
  - [ ] Facilitar pull de código
  - [ ] Build imagen
  - [ ] Boot container
  - [ ] Ejecutar health check

---

### ✅ **Post-Deployment Verification**

#### Inmediatamente después del deploy:

- [ ] Verificar que el container está running
  ```
  Easypanel → App → Status: 🟢 Running
  ```

- [ ] Health check passing
  ```bash
  curl https://tu-dominio.com/api/db-status
  # ✅ {"status":"CONNECTED", "restaurantCount": 3}
  ```

- [ ] Logs sin errores
  ```
  Easypanel → App → Logs → "Base de datos conectada correctamente"
  ```

- [ ] CPU/Memory normal
  ```
  Easypanel → Metrics → CPU < 30%, Memory < 50%
  ```

#### Funcionalidad:

- [ ] GET /api/restaurants responde
  ```bash
  curl https://tu-dominio.com/api/restaurants
  # ✅ JSON array con restaurantes
  ```

- [ ] Seed data cargado
  ```bash
  curl https://tu-dominio.com/api/db-status
  # ✅ "restaurantCount": 3
  ```

- [ ] CREATE endpoint funciona
  ```bash
  curl -X POST https://tu-dominio.com/api/restaurants \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","description":"Test","cuisineType":"International"}'
  # ✅ 201 Created + ID
  ```

---

## 📋 RESUMEN RÁPIDO

### Archivos a verificar:
```
✅ Dockerfile
✅ docker-compose.prod.yml
✅ .env.prod.example
✅ EASYPANEL_DEPLOYMENT.md
✅ prisma/schema.prisma
✅ prisma/seed.js
✅ dev-server.js
✅ package.json (con scripts db:*)
```

### Secretos a generar:
```bash
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
# Guardar en .env.prod (NO en Git)
```

### Configurar en Easypanel:
```
1. GitHub: repositories → restaurants-backend
2. Variables: NODE_ENV, PORT, JWT_SECRET, DATABASE_URL, CORS_ORIGIN
3. Database: PostgreSQL 15 (Easypanel managed)
4. Deploy: Branch main, Dockerfile build
5. Health Check: GET /api/db-status
```

### Verificar después:
```bash
curl https://tu-dominio.com/api/db-status
curl https://tu-dominio.com/api/restaurants
```

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

### ❌ "Connection refused" en BD
- [ ] Verificar DATABASE_URL
- [ ] BD está corriendo en Easypanel
- [ ] Credenciales correctas

### ❌ "ENV variable not found"
- [ ] Revisar nombre exacto de variable
- [ ] Re-deployar después de agregar
- [ ] Usar Easypanel dashboard (NO .env)

### ❌ "Container exits"
- [ ] Ver logs completos
- [ ] `npm ci --production` funciona localmente
- [ ] `npx prisma generate` ejecutado

### ❌ "CORS error"
- [ ] Actualizar CORS_ORIGIN sin trailing slash
- [ ] Re-deployar
- [ ] Esperar 30s a que cache limpie

### ❌ "Build fails"
- [ ] Dockerfile build OK localmente
- [ ] package-lock.json sincronizado
- [ ] No hay archivos huge (.env.prod, node_modules)

---

## 📊 MÉTRICAS ESPERADAS POST-DEPLOY

| Métrica | Expected | Alert Threshold |
|---------|----------|-----------------|
| CPU Usage | < 10% | > 80% |
| Memory | < 200MB | > 400MB |
| Request Latency | < 100ms | > 500ms |
| Error Rate | < 0.1% | > 1% |
| Health Check | 200 OK | Any fail |
| DB Connections | < 5 | > 20 |

---

## ✨ TODO completado

- [x] Local testing ✅
- [x] Docker image creada ✅
- [x] .env.prod.example listo ✅
- [x] docker-compose.prod.yml listo ✅
- [x] Dokumentación completa ✅
- [x] Secretos generados (guardar en Easypanel)
- [ ] Deploy a Easypanel (próximo paso)
- [ ] Domain configurado (posteriore)
- [ ] SSL/HTTPS automático (Easypanel Let's Encrypt)
- [ ] Monitoring y alertas (posteriore)

---

## 🎯 PRÓXIMO PASO

```
1. Copiar .env.prod.example → .env.prod
2. Editar .env.prod con valores reales
   - Generar JWT_SECRET nuevo
   - Generar JWT_REFRESH_SECRET nuevo
   - Cambiar CORS_ORIGIN a tu dominio
   - Usar DATABASE_URL de Easypanel

3. En Easypanel Dashboard:
   - Conectar GitHub
   - Agregar todas las variables de .env.prod
   - Deploy
   - Esperar health check
   - Verificar `/api/db-status`

4. Success! 🎉
```

---

**Status**: ✅ Ready
**Last Updated**: 11 de abril de 2026
**Deployed By**: Your Team
