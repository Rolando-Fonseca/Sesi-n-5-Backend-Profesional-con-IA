# 🚀 DEPLOYMENT EASYPANEL - GUÍA PASO A PASO

**Estado**: ✅ Listo para Deploy  
**Fecha**: 11 de abril de 2026  
**Versión**: v1.1.0  

---

## ANTES DE EMPEZAR

✅ Código ya está en GitHub (branch main, tag v1.1.0)  
✅ Documentación completa  
✅ Docker configurado  
✅ Secrets generables  

---

## ⚡ QUICKSTART (15 minutos)

### **PASO 1: Generar Secretos Localmente (2 min)**

Ejecuta en PowerShell:
```powershell
# En Windows PowerShell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\easy-deploy.ps1
```

O en Bash (Linux/Mac):
```bash
chmod +x easy-deploy.sh
./easy-deploy.sh
```

**Qué sucede:**
- ✅ Verifica Node, npm, Git
- ✅ Genera JWT_SECRET seguro
- ✅ Genera JWT_REFRESH_SECRET seguro
- ✅ Crea `.env.prod` con secretos
- ✅ Muestra instrucciones finales

**Output esperado:**
```
✓ Secretos generados
✓ .env.prod creado con secretos generados
✓ Todos los archivos de deployment listos
```

---

### **PASO 2: Revisar .env.prod (1 min)**

Abre `.env.prod` y verifica (ya tiene secretos):

```env
NODE_ENV=production           ✓ (Ya tiene valor)
PORT=3000                     ✓ (Ya tiene valor)
JWT_SECRET=<generado>         ✓ (Automático)
JWT_REFRESH_SECRET=<generado> ✓ (Automático)
CORS_ORIGIN=https://tu-dominio.com  ⚠️ CAMBIAR a tu dominio
DATABASE_URL=...              ⚠️ VACÍO (Easypanel lo da)
```

**Cambios necesarios:**
```env
# Cambiar ESTA línea:
CORS_ORIGIN=https://REPLACE_WITH_YOUR_DOMAIN.com

# A tu dominio real cuando Easypanel te lo asigne:
CORS_ORIGIN=https://restaurants-api.easypanel.io
# O si usas dominio personalizado:
CORS_ORIGIN=https://api.tu-nombredominio.com
```

---

### **PASO 3: Ya está en GitHub (0 min - YA HECHO)**

✅ Todo ya pusheado:
```
Commit: 7ee0f49
Tag: v1.1.0
Branch: main
Estado: Sincronizado
```

---

## 📱 EASYPANEL DASHBOARD (10 minutos)

### **PASO 4: Crear Cuenta y Acceder**

1. Ve a https://easypanel.io
2. Crea cuenta (si no tienes)
3. Login al dashboard
4. **Click en: "+ Create Service" o "+ Add Application"**

---

### **PASO 5: Conectar GitHub**

En el dashboard de Easypanel:

1. **Type**: GitHub
2. **Click "Connect GitHub"**
3. Autoriza Easypanel en tu cuenta GitHub
4. **Select Repository**: 
   - Usuario: `Rolando-Fonseca` (o tu usuario)
   - Repo: `Sesi-n-5-Backend-Profesional-con-IA`
   - Branch: `main`

---

### **PASO 6: Configurar Aplicación**

**Sección: Configuration**

```
Name:              restaurants-api
Port:              3000
Health Check:      GET /api/db-status  ← IMPORTANTE
Restart Policy:    unless-stopped
Build Type:        Dockerfile
Dockerfile Path:   ./Dockerfile
Build Context:     .
```

---

### **PASO 7: Agregar Variables de Entorno**

**En Easypanel → Variables de Entorno**

Copia estas variables (desde tu `.env.prod` local):

```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://tu-dominio-asignado.com
JWT_SECRET=<el-valor-que-generó-easy-deploy.ps1>
JWT_REFRESH_SECRET=<el-otro-valor-generado>
LOG_LEVEL=info
APP_NAME=Restaurants API
APP_VERSION=1.1.0
```

⚠️ **NO incluyas DATABASE_URL aún** (la daremos en paso 9)

---

### **PASO 8: Crear Base de Datos PostgreSQL**

En Easypanel → **+ Create Service** → **PostgreSQL**

```
Version:        15
Database Name:  restaurants_prod
Username:       restaurants_user
Password:       <Easypanel genera - guardar>
Restart:        unless-stopped
```

⏳ Esperar 30 segundos a que se cree.

**Easypanel te mostrará al final:**
```
Database URL: postgresql://...
```

📋 **COPIAR ESTE URL COMPLETO**

---

### **PASO 9: Agregar DATABASE_URL**

De vuelta en tu app → Variables de Entorno → Agregar:

```env
DATABASE_URL=postgresql://restaurants_user:PASSWORD@host:port/restaurants_prod
```

Usar el URL que Easypanel generó en Paso 8.

---

### **PASO 10: Deploy**

1. Click **"Deploy"** (botón grande azul)
2. Esperar a que termine:
   - ✅ Pulling code from GitHub
   - ✅ Building Docker image
   - ✅ Starting container
   - ✅ Health check passing

⏰ Espera 2-3 minutos.

**Estado esperado**: 🟢 **Running**

---

## ✅ VERIFICACIÓN POST-DEPLOY (3 min)

### **PASO 11: Health Check**

En Easypanel → **App** → **Health**: debe mostrar 🟢 **Healthy**

Si falla, revisar Logs:

```
Easypanel → Logs → últimas 50 líneas
Buscar: "Base de datos conectada correctamente"
```

---

### **PASO 12: Cargar Seed Data (Datos Iniciales)**

En Easypanel → **Terminal** o SSH:

```bash
npm run db:setup
```

Esta acción:
1. Sincroniza schema Prisma
2. Carga 3 restaurantes
3. Carga 3 usuarios
4. Carga datos de prueba

**Output esperado:**
```
✓ Creating users...
✓ Creating restaurants...
✓ Creating locations...
✓ Creating categories...
✓ Creating dishes...
✓ Creating tables...
```

---

### **PASO 13: Test Final**

Ejecuta en tu terminal local:

```bash
# Reemplaza tu-dominio con el URL de Easypanel
curl https://tu-dominio.easypanel.io/api/db-status

# Respuesta esperada:
{
  "status": "CONNECTED",
  "restaurantCount": 3,
  "database": "PostgreSQL",
  "timestamp": "2026-04-11T..."
}
```

✅ Si obtienes esta respuesta: **¡DEPLOYMENT EXITOSO!**

---

## 🎯 ENDPOINTS DISPONIBLES

Una vez deployado, estos endpoints funcionarán:

```bash
# Test health
curl https://tu-dominio.com/api

# Ver restaurantes
curl https://tu-dominio.com/api/restaurants

# Ver status BD
curl https://tu-dominio.com/api/db-status

# Crear restaurante
curl -X POST https://tu-dominio.com/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Restaurant",
    "description": "Description",
    "cuisineType": "Italian"
  }'
```

---

## 🔧 TROUBLESHOOTING RÁPIDO

### ❌ "Health check failing"

```
→ Revisar Logs en Easypanel
→ Buscar: "Error connecting to database"
→ Verificar DATABASE_URL está en variables
→ Verificar BD está corriendo
```

Solución:
```bash
# En SSH de Easypanel
psql $DATABASE_URL -c "SELECT 1;"
```

---

### ❌ "Build failing"

```
→ Revisar Docker build logs
→ Verificar que Dockerfile existe
→ Verificar package.json es válido
```

Solución:
```bash
# En tu máquina
npm ci --production
npx prisma generate
docker build -t test .  # Prueba build localmente
```

---

### ❌ "No restaurants showing"

```
→ Seed data no cargado
```

Solución (en SSH de Easypanel):
```bash
npm run db:seed
```

---

### ❌ "CORS error"

```
→ CORS_ORIGIN no matches tu dominio
```

Solución:
1. Easypanel → Variables
2. Cambiar CORS_ORIGIN al URL exacto
3. Redeploy (botón Deploy)

---

## 📊 MONITOREO POST-DEPLOY

### **Métricas a Verificar**

```
CPU Usage:      < 30% ✓
Memory Usage:   < 200MB ✓
Requests/sec:   < 100 ✓
Error Rate:     < 0.1% ✓
Health Check:   200 OK ✓
```

### **Logs a Buscar**

✅ Esperado:
```
✓ Base de datos conectada correctamente
✓ Servidor corriendo en...
✓ Health check passed
```

❌ Investigar si ves:
```
✗ Error connecting to database
✗ Cannot find module
✗ Health check failed
```

---

## 🎯 CHECKLIST FINAL

Antes de considerar deployment exitoso:

- [ ] Health check: 🟢 Green
- [ ] Logs sin errores
- [ ] `GET /api/db-status` devuelve CONNECTED
- [ ] Restaurantes aparecen en `GET /api/restaurants`
- [ ] CPU/Memory normal
- [ ] `npm run db:setup` ejecutado (seed data loaded)

---

## 📞 NECESITAS AYUDA?

**Si algo falla:**

1. **Revisar logs**: Easypanel → Logs → ultimas 100 líneas
2. **Terminal SSH**: Easypanel → Terminal
3. **Documentación**: [EASYPANEL_DEPLOYMENT.md](./EASYPANEL_DEPLOYMENT.md)
4. **Checklist**: [EASYPANEL_CHECKLIST.md](./EASYPANEL_CHECKLIST.md)

---

## 🎊 DESPUÉS DEL DEPLOYMENT

Una vez deployado exitosamente:

### **Configuración de Dominio**

Si tienes dominio personalizado:
1. Easypanel → Settings
2. Add Custom Domain
3. Actualizar CORS_ORIGIN si es necesario
4. SSL automático (Let's Encrypt)

### **Monitoring**

Configura alertas en Easypanel para:
- Health check falla
- Memory > 80%
- CPU > 80%
- Deploy fail

### **Mantenimiento**

- Backups automáticos de BD (Easypanel maneja)
- Updates de dependencias (revisión mensual)
- Monitoreo de logs (diario)

---

## ✨ SUMMARY

### Tiempo Total: ~15 minutos

| Paso | Tiempo | Acción |
|------|--------|--------|
| 1 | 2 min | Ejecutar `easy-deploy.ps1` |
| 2 | 1 min | Revisar `.env.prod` |
| 3 | 0 min | Ya en GitHub |
| 4-5 | 2 min | Acceder Easypanel + GitHub |
| 6-7 | 2 min | Configurar app |
| 8-9 | 3 min | BD + variables |
| 10 | 3 min | Deploy |
| 11-13 | 2 min | Verificar |
| **TOTAL** | **~15 min** | ✅ Deployment Exitoso |

---

## 🚀 ¡LISTO!

**Tienes todo para deployar.**

**Próximo paso:**

1. Abre https://easypanel.io
2. Login a tu cuenta
3. Sigue los pasos 4-10 arriba
4. ¡Deploy!

---

**Happy Deploying! 🎉**

Generated: 11 de abril de 2026  
Version: v1.1.0 - Easypanel Deployment Ready
