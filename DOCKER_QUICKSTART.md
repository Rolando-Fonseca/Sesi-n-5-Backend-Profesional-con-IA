# 🐳 Docker Setup - Quick Start Guide

> **Phase 10 Complete** ✅ Docker PostgreSQL infrastructure is ready to use

---

## 📋 What Was Just Created

```
✅ docker-compose.yml        - PostgreSQL + PgAdmin infrastructure
✅ scripts/init.sql          - Database schema initialization  
✅ .env.docker               - Pre-filled environment variables
✅ DATABASE_SETUP.md         - Comprehensive documentation
```

---

## 🚀 Start Here (60 seconds)

### Step 1: Copy Environment File
```bash
# Copy the pre-configured .env file
cp .env.docker .env
```

### Step 2: Start Docker Containers
```bash
# Start PostgreSQL + PgAdmin in the background
docker-compose up -d

# Verify containers are running
docker-compose ps
```

**Expected Output:**
```
NAME                COMMAND                  SERVICE      STATUS
restaurants_db      "docker-entrypoint..."   postgres     Up (healthy)
restaurants_pgadmin "python3 /pgadmin..."    pgadmin      Up
```

### Step 3: Verify Database Connection
```bash
# Test PostgreSQL is responding
docker exec restaurants_db pg_isready -U restaurants_user

# Expected: accepting connections
```

---

## 🔐 Database Credentials (In .env Now)

Copy-paste ready for your .env file:

```env
DATABASE_URL=postgresql://restaurants_user:RestaurantsSecure123!%40%23@localhost:5432/restaurants_dev
```

**Connection Details:**
| Setting | Value |
|---------|-------|
| **Host** | localhost |
| **Port** | 5432 |
| **User** | restaurants_user |
| **Password** | RestaurantsSecure123!@# |
| **Database** | restaurants_dev |

---

## 🎯 Next Steps (5 minutes)

### Step 4: Install Backend Dependencies
```bash
npm install
```

### Step 5: Create Database Tables (Prisma Migration)
```bash
# This will:
# 1. Connect to Docker PostgreSQL
# 2. Create all tables from schema.prisma
# 3. Generate Prisma client
npx prisma migrate dev --name init
```

### Step 6: Start the Backend Server
```bash
npm run start:dev
```

**Expected Output:**
```
[Nest] .... - 04/10/2026, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] .... - 04/10/2026, 10:30:01 AM     LOG [InstanceLoader] RestaurantsModule dependencies initialized
...
[Nest] .... - 04/10/2026, 10:30:02 AM     LOG [NestApplication] Nest application successfully started +30ms
```

---

## 🌐 Access Your Application

Once everything is running:

| Service | URL | Purpose |
|---------|-----|---------|
| **REST API** | http://localhost:3000 | Backend API server |
| **Swagger Docs** | http://localhost:3000/api | Interactive API documentation |
| **PgAdmin** | http://localhost:5050 | Database management UI |

### PgAdmin Web Interface
```
URL: http://localhost:5050
Email: admin@restaurants.local
Password: AdminPassword123!@#
```

---

## 💡 Useful Commands

### Docker Management
```bash
# View logs
docker-compose logs postgres     # See database logs
docker-compose logs pgadmin      # See PgAdmin logs
docker-compose logs -f postgres  # Follow logs in real-time

# Stop containers
docker-compose down              # Stop (keep volumes)
docker-compose down -v           # Stop & delete volumes (⚠️ data lost!)

# Restart
docker-compose restart postgres  # Restart just database
```

### Database Connection (Alternative Methods)

**Using psql (command-line):**
```bash
psql -h localhost -U restaurants_user -d restaurants_dev
# Password: RestaurantsSecure123!@#
```

**Using DBeaver (GUI):**
1. New Connection → PostgreSQL
2. Host: localhost
3. Port: 5432
4. Database: restaurants_dev
5. User: restaurants_user
6. Password: RestaurantsSecure123!@#
7. Test Connection → OK

**Using Prisma Studio (Data Browser):**
```bash
npx prisma studio
# Opens http://localhost:5555 with visual database browser
```

### Backend Development
```bash
# Run tests
npm test                         # Run unit tests
npm run test:e2e                # Run E2E tests with real database
npm run test:cov                # Test coverage report

# Build for production
npm run build
npm run start:prod
```

---

## ⚠️ Troubleshooting

### "Connection refused" error?

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Make sure containers are running
docker-compose ps

# If not running, start them
docker-compose up -d

# Check if PostgreSQL is healthy
docker-compose logs postgres | tail -20
```

### "Database does not exist" error?

**Problem:** `FATAL: database "restaurants_dev" does not exist`

**Solution:**
```bash
# The database is auto-created by docker-compose
# If it doesn't exist, run:
docker-compose down -v  # Delete volumes
docker-compose up -d    # Recreate with clean database

# Then run migrations
npx prisma migrate dev --name init
```

### "Authentication failed" error?

**Problem:** `FATAL: role "restaurants_user" does not exist`

**Solution:**
Check your DATABASE_URL in .env matches exactly:
```env
# ✅ CORRECT
DATABASE_URL=postgresql://restaurants_user:RestaurantsSecure123!%40%23@localhost:5432/restaurants_dev

# ❌ WRONG (special chars not URL-encoded)
DATABASE_URL=postgresql://restaurants_user:RestaurantsSecure123!@#@localhost:5432/restaurants_dev

# ❌ WRONG (wrong port)
DATABASE_URL=postgresql://restaurants_user:RestaurantsSecure123!%40%23@localhost:3306/restaurants_dev
```

### Can't access PgAdmin web interface?

**Problem:** `http://localhost:5050` connection timed out

**Solution:**
```bash
# Check if pgadmin container is running
docker-compose ps

# If not, start it
docker-compose up -d pgadmin

# Check logs
docker-compose logs pgadmin

# Wait 30 seconds for PgAdmin to initialize, then refresh browser
```

---

## 📊 Full Setup Checklist

- [ ] **docker-compose.yml** exists  
- [ ] **.env** file created from .env.docker  
- [ ] `docker-compose up -d` executed  
- [ ] `docker-compose ps` shows 2 healthy containers  
- [ ] `npm install` completed  
- [ ] `npx prisma migrate dev` executed successfully  
- [ ] `npm run start:dev` server is running  
- [ ] `http://localhost:3000/api` returns Swagger docs  
- [ ] `http://localhost:5050` PgAdmin is accessible  
- [ ] Database has 11 tables (Users, Restaurants, Menus, etc.)  

---

## 🔒 Security Reminder

⚠️ **These credentials are for LOCAL DEVELOPMENT ONLY**

### Before Production Deployment:

1. **Change JWT Secrets**
   ```env
   JWT_SECRET=your-real-random-secret-min-32-chars
   JWT_REFRESH_SECRET=your-real-random-secret-min-32-chars
   ```

2. **Change Database Password**
   - Update docker-compose.yml
   - Update .env

3. **Use Managed Database**
   - AWS RDS, Google Cloud SQL, Supabase, etc.
   - Never expose database to public internet

4. **Enable SSL/TLS**
   - For Prisma: `?sslmode=require` in DATABASE_URL
   - For API: Use HTTPS (reverse proxy like Nginx)

5. **Set NODE_ENV to production**
   ```env
   NODE_ENV=production
   ```

---

## 📚 Full Documentation

For complete documentation, see:
- **DATABASE_SETUP.md** - Detailed database configuration guide
- **BACKEND_SETUP.md** - Backend development guide
- **api_contracts.md** - API endpoint specifications
- **db_model.md** - Database schema documentation
- **architecture_nest.md** - NestJS architecture overview

---

## ✅ You're Ready!

Your complete backend infrastructure is now:
- ✅ Containerized with Docker
- ✅ Running PostgreSQL 15
- ✅ Configured with Prisma ORM
- ✅ Ready for API development
- ✅ Documented and tested

**Next:** Run the commands in Step 1-6 above and you'll have a fully functional local backend! 🚀

---

**Phase 10 Status**: Complete ✅  
**Next Phase**: Docker execution + Prisma migrations  
**Estimated Time**: ~10 minutes from here
