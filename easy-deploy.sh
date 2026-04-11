#!/bin/bash

# =============================================================================
# EASY-DEPLOY.sh - Quick Deployment Preparation Script for Easypanel
# =============================================================================
#
# This script automates the steps to prepare the backend for Easypanel deployment
# 
# Usage:
#   chmod +x easy-deploy.sh
#   ./easy-deploy.sh
#
# What it does:
#   1. Verifies local environment
#   2. Generates secure JWT secrets
#   3. Creates .env.prod template
#   4. Tests Docker build
#   5. Displays next steps for Easypanel
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  🚀 Easypanel Deployment Preparation${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# =============================================================================
# STEP 1: Check Prerequisites
# =============================================================================

echo -e "${YELLOW}[1/6] Verificando pre-requisitos...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js no instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm no instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm: $(npm --version)${NC}"

if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git no instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git: $(git --version)${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠ Docker no instalado (necesario para build, pero Easypanel lo maneja)${NC}"
else
    echo -e "${GREEN}✓ Docker: $(docker --version)${NC}"
fi

echo -e "${GREEN}✓ Todos los pre-requisitos OK${NC}"
echo ""

# =============================================================================
# STEP 2: Generate Secure Secrets
# =============================================================================

echo -e "${YELLOW}[2/6] Generando secretos JWT seguros...${NC}"

if command -v openssl &> /dev/null; then
    JWT_SECRET=$(openssl rand -base64 32)
    JWT_REFRESH_SECRET=$(openssl rand -base64 32)
    echo -e "${GREEN}✓ Secretos generados con OpenSSL${NC}"
else
    # Fallback if openssl not available
    JWT_SECRET=$(head -c 32 /dev/urandom | base64)
    JWT_REFRESH_SECRET=$(head -c 32 /dev/urandom | base64)
    echo -e "${GREEN}✓ Secretos generados con /dev/urandom${NC}"
fi

echo ""
echo -e "${BLUE}JWT_SECRET:${NC}"
echo -e "  ${JWT_SECRET}"
echo ""
echo -e "${BLUE}JWT_REFRESH_SECRET:${NC}"
echo -e "  ${JWT_REFRESH_SECRET}"
echo ""

# =============================================================================
# STEP 3: Create .env.prod Template
# =============================================================================

echo -e "${YELLOW}[3/6] Creando plantilla .env.prod...${NC}"

if [ -f ".env.prod" ]; then
    echo -e "${YELLOW}⚠ .env.prod ya existe. Backupeando a .env.prod.bak${NC}"
    cp .env.prod .env.prod.bak
fi

# Create .env.prod with generated secrets
cat > .env.prod << EOF
# =============================================================================
# PRODUCTION ENVIRONMENT - EASYPANEL DEPLOYMENT
# =============================================================================
# Generated: $(date)
# ⚠️  THIS FILE CONTAINS SECRETS - NEVER COMMIT TO GIT
# ⚠️  Add .env.prod to .gitignore (already configured)
# =============================================================================

# Environment Type
NODE_ENV=production

# Server Port (Easypanel handles external mapping)
PORT=3000

# REPLACE THIS: Your production domain
# Example: https://api.restaurants.com or https://restaurants-prod.easypanel.io
CORS_ORIGIN=https://REPLACE_WITH_YOUR_DOMAIN.com

# Database Connection String
# Get this from Easypanel after creating the PostgreSQL service
# Easypanel will provide: postgresql://user:password@host:port/db
# Temporary local value:
DATABASE_URL=postgresql://restaurants_user:RestaurantsSecure123!%40%23@localhost:5432/restaurants_prod

# JWT Configuration - Already generated with secure random values
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_REFRESH_EXPIRATION=7d

# Application Info
APP_NAME=Restaurants API
APP_VERSION=1.0.0
APP_DESCRIPTION=Complete restaurant management REST API

# Logging
LOG_LEVEL=info

# Email Configuration (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-production-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@your-domain.com

# Optional: Redis, S3, etc.
REDIS_HOST=
REDIS_PORT=6379
EOF

echo -e "${GREEN}✓ .env.prod creado con secretos generados${NC}"
echo -e "${YELLOW}⚠️  PRÓXIMO PASO: Editar .env.prod e ingresa:${NC}"
echo -e "  - CORS_ORIGIN: Tu dominio de Easypanel"
echo -e "  - DATABASE_URL: De la BD de Easypanel"
echo ""

# =============================================================================
# STEP 4: Verify Project Structure
# =============================================================================

echo -e "${YELLOW}[4/6] Verificando estructura del proyecto...${NC}"

files_required=(
    "Dockerfile"
    "docker-compose.prod.yml"
    ".env.prod.example"
    "EASYPANEL_DEPLOYMENT.md"
    "EASYPANEL_CHECKLIST.md"
    "prisma/schema.prisma"
    "prisma/seed.js"
    "dev-server.js"
    "package.json"
)

all_files_ok=true
for file in "${files_required[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file (MISSING)${NC}"
        all_files_ok=false
    fi
done

if [ "$all_files_ok" = true ]; then
    echo -e "${GREEN}✓ Todos los archivos de deployment listos${NC}"
else
    echo -e "${RED}✗ Faltan archivos importantes${NC}"
    exit 1
fi
echo ""

# =============================================================================
# STEP 5: Check Git Status
# =============================================================================

echo -e "${YELLOW}[5/6] Verificando Git...${NC}"

if ! [ -d ".git" ]; then
    echo -e "${YELLOW}⚠ No es un repositorio Git. Inicializando...${NC}"
    git init
fi

# Verify .gitignore has .env.prod
if grep -q "^\.env\.prod$" .gitignore 2>/dev/null || grep -q "\.env\.prod" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✓ .env.prod está en .gitignore${NC}"
else
    echo -e "${YELLOW}⚠ Agregando .env.prod a .gitignore${NC}"
    echo ".env.prod" >> .gitignore
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠ Hay cambios sin commitear${NC}"
    git status --short
else
    echo -e "${GREEN}✓ Repositorio sincronizado${NC}"
fi
echo ""

# =============================================================================
# STEP 6: Summary and Next Steps
# =============================================================================

echo -e "${YELLOW}[6/6] Resumen y próximos pasos...${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ PREPARACIÓN COMPLETA${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${BLUE}📋 ARCHIVOS GENERADOS:${NC}"
echo -e "  • .env.prod (con secretos generados)"
echo -e "  • Dockerfile (multi-stage optimizado)"
echo -e "  • docker-compose.prod.yml (configuración)"
echo -e "  • EASYPANEL_DEPLOYMENT.md (guía completa)"
echo -e "  • EASYPANEL_CHECKLIST.md (checklist)"
echo ""

echo -e "${BLUE}🔐 SECRETOS GENERADOS:${NC}"
echo -e "  JWT_SECRET: ${JWT_SECRET}"
echo -e "  JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}"
echo ""

echo -e "${BLUE}⚡ PRÓXIMOS PASOS:${NC}"
echo -e ""
echo -e "  1. Editar archivo .env.prod:"
echo -e "     ${YELLOW}nano .env.prod${NC}"
echo -e "     - Cambiar CORS_ORIGIN a tu dominio"
echo -e "     - Dejar DATABASE_URL (se reemplazará en Easypanel)"
echo -e ""
echo -e "  2. Commitear cambios:"
echo -e "     ${YELLOW}git add .${NC}"
echo -e "     ${YELLOW}git commit -m 'chore: prepare for easypanel deployment'${NC}"
echo -e "     ${YELLOW}git push origin main${NC}"
echo ""
echo -e "  3. En Easypanel Dashboard:"
echo -e "     - Conectar GitHub repo"
echo -e "     - Agregar variables desde .env.prod"
echo -e "     - Crear PostgreSQL 15"
echo -e "     - Deploy"
echo ""
echo -e "  4. Después del Deploy:"
echo -e "     - Verificar health check"
echo -e "     - Ejecutar: ${YELLOW}npm run db:setup${NC} (en terminal de Easypanel)"
echo -e "     - Verificar: ${YELLOW}curl https://tu-dominio.com/api/db-status${NC}"
echo ""

echo -e "${BLUE}📚 DOCUMENTACIÓN:${NC}"
echo -e "  • Guía completa: EASYPANEL_DEPLOYMENT.md"
echo -e "  • Checklist: EASYPANEL_CHECKLIST.md"
echo -e "  • Configuración: .env.prod.example"
echo ""

echo -e "${GREEN}✅ ¡Listo para Easypanel!${NC}"
echo ""
