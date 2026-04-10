# 🐘 PostgreSQL Database Configuration

## Container Information
- **Container Name**: restaurants_db
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Host**: localhost (or postgres if running in same network)

## Database Credentials

### PostgreSQL Admin
```
HOST: localhost
PORT: 5432
USER: restaurants_user
PASSWORD: RestaurantsSecure123!@#
DATABASE: restaurants_dev
```

### PgAdmin Access
```
URL: http://localhost:5050
Email: admin@restaurants.local
Password: AdminPassword123!@#
```

## Quick Start

### 1️⃣ Start Docker Containers
```bash
# Start PostgreSQL and PgAdmin
docker-compose up -d

# Check containers are running
docker-compose ps

# View logs
docker-compose logs -f postgres
```

### 2️⃣ Connect to Database

#### Using psql (if installed locally)
```bash
psql -h localhost -U restaurants_user -d restaurants_dev -p 5432

# Password: RestaurantsSecure123!@#
```

#### Using DBeaver
```
Connection Type: PostgreSQL
Host: localhost
Port: 5432
Database: restaurants_dev
Username: restaurants_user
Password: RestaurantsSecure123!@#
```

#### Using PgAdmin Web Interface
```
URL: http://localhost:5050
Email: admin@restaurants.local
Password: AdminPassword123!@#
```

### 3️⃣ Configure .env
Copy these values to your `.env` file:
```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://restaurants_user:RestaurantsSecure123!%40%23@localhost:5432/restaurants_dev

# JWT (configure your own secret keys!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRATION=7d
```

### 4️⃣ Run Migrations
```bash
# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate dev --name init

# Or push schema without migrations
npx prisma db push

# View database with Prisma Studio
npx prisma studio
```

### 5️⃣ Seed Database (Optional)
```bash
# Create seed data
npx prisma db seed
```

### 6️⃣ Start Dev Server
```bash
npm run start:dev
```

## Useful Commands

### Docker Commands
```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Remove volumes (WARNING: deletes data!)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build

# View logs
docker-compose logs postgres
docker-compose logs pgadmin

# Execute commands in container
docker exec -it restaurants_db psql -U restaurants_user -d restaurants_dev

# Backup database
docker exec restaurants_db pg_dump -U restaurants_user restaurants_dev > backup.sql

# Restore database
docker exec -i restaurants_db psql -U restaurants_user restaurants_dev < backup.sql
```

### Prisma Commands
```bash
# View database UI
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name add_new_table

# Reset database (WARNING: deletes all data!)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

## Database URL Explanation

The DATABASE_URL format:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Important**: The `@#` in password needs URL encoding as `%40%23`:
- `@` → `%40`
- `#` → `%23`

## Health Check

To verify the database is running:
```bash
# Check container health
docker-compose ps

# Expected output:
# NAME                      STATUS
# restaurants_db            Up (healthy)
# restaurants_pgadmin       Up
```

## Troubleshooting

### Connection Refused
```bash
# Check if port 5432 is in use
netstat -ano | findstr :5432

# Kill process using the port (Windows)
taskkill /PID <PID> /F
```

### Database Connection Error
```bash
# Verify DATABASE_URL in .env
# Ensure pg_isready succeeds
docker exec restaurants_db pg_isready -U restaurants_user -d restaurants_dev

# Check PostgreSQL is listening
docker exec -it restaurants_db psql -U restaurants_user -d restaurants_dev -c "SELECT version();"
```

### PgAdmin Can't Connect
```bash
# Wait for database to fully start (5-10 seconds)
# In PgAdmin, add Server:
# - Host: postgres (not localhost - use service name)
# - Port: 5432
# - Username: restaurants_user
# - Password: RestaurantsSecure123!@#
# - Database: restaurants_dev
```

## Production Considerations

⚠️ **NEVER USE THESE CREDENTIALS IN PRODUCTION**

For production:
1. Generate secure passwords
2. Use environment variables for secrets
3. Enable SSL/TLS for connections
4. Set up automated backups
5. Configure database replication
6. Use managed databases (RDS, Cloud SQL, Supabase, etc.)

## Notes

- Database uses Alpine Linux image (small, fast)
- PgAdmin is included for web-based management
- Health checks ensure container is ready
- Volumes persist data between container restarts
- Network isolation for security

---

**Generated**: 2026-04-10  
**PostgreSQL Version**: 15 (Alpine)  
**Status**: ✅ Ready for Development
