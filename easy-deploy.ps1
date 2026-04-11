# =============================================================================
# easy-deploy.ps1 - Quick Deployment Preparation Script for Easypanel (Windows)
# =============================================================================
#
# This script automates the steps to prepare the backend for Easypanel deployment
# 
# Usage:
#   powershell -ExecutionPolicy Bypass -File easy-deploy.ps1
#
# Or set execution policy temporarily:
#   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
#   .\easy-deploy.ps1
#
# What it does:
#   1. Verifies local environment
#   2. Generates secure JWT secrets
#   3. Creates .env.prod template
#   4. Verifies project structure
#   5. Displays next steps for Easypanel
# =============================================================================

function Write-Header {
    param([string]$text)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host ""
}

function Write-Success {
    param([string]$text)
    Write-Host "✓ $text" -ForegroundColor Green
}

function Write-Warning {
    param([string]$text)
    Write-Host "⚠ $text" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$text)
    Write-Host "✗ $text" -ForegroundColor Red
}

function Write-Info {
    param([string]$text)
    Write-Host "ℹ $text" -ForegroundColor Cyan
}

# =============================================================================

Write-Header "🚀 Easypanel Deployment Preparation"

# =============================================================================
# STEP 1: Check Prerequisites
# =============================================================================

Write-Host ""
Write-Host "[1/6] Verificando pre-requisitos..." -ForegroundColor Yellow
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js: $nodeVersion"
} catch {
    Write-Error "Node.js no está instalado"
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Success "npm: $npmVersion"
} catch {
    Write-Error "npm no está instalado"
    exit 1
}

# Check Git
try {
    $gitVersion = git --version
    Write-Success "Git: $gitVersion"
} catch {
    Write-Error "Git no está instalado"
    exit 1
}

# Check Docker (optional)
try {
    $dockerVersion = docker --version
    Write-Success "Docker: $dockerVersion"
} catch {
    Write-Warning "Docker no instalado (Easypanel maneja la compilación)"
}

Write-Success "Todos los pre-requisitos OK"

# =============================================================================
# STEP 2: Generate Secure Secrets
# =============================================================================

Write-Host ""
Write-Host "[2/6] Generando secretos JWT seguros..." -ForegroundColor Yellow
Write-Host ""

# Generate random base64 strings for JWT secrets
$JWT_SECRET = [Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
$JWT_REFRESH_SECRET = [Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))

Write-Success "Secretos generados"
Write-Host ""
Write-Host "JWT_SECRET:" -ForegroundColor Cyan
Write-Host "  $JWT_SECRET" -ForegroundColor White
Write-Host ""
Write-Host "JWT_REFRESH_SECRET:" -ForegroundColor Cyan
Write-Host "  $JWT_REFRESH_SECRET" -ForegroundColor White
Write-Host ""

# =============================================================================
# STEP 3: Create .env.prod Template
# =============================================================================

Write-Host "[3/6] Creando plantilla .env.prod..." -ForegroundColor Yellow
Write-Host ""

# Backup existing .env.prod if it exists
if (Test-Path ".env.prod") {
    Write-Warning ".env.prod ya existe. Backupeando a .env.prod.bak"
    Copy-Item ".env.prod" ".env.prod.bak" -Force
}

# Create .env.prod content
$envContent = @"
# =============================================================================
# PRODUCTION ENVIRONMENT - EASYPANEL DEPLOYMENT
# =============================================================================
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# ⚠️  THIS FILE CONTAINS SECRETS - NEVER COMMIT TO GIT
# ⚠️  Add to .gitignore: .env.prod
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
# Format: postgresql://user:password@host:port/database
DATABASE_URL=postgresql://restaurants_user:PASSWORD@HOST:5432/restaurants_prod

# JWT Configuration - Already generated with secure random values
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
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
"@

# Write to file
$envContent | Out-File -FilePath ".env.prod" -Encoding UTF8

Write-Success ".env.prod creado con secretos generados"
Write-Warning "PRÓXIMO PASO: Editar .env.prod and ingresa:"
Write-Host "  - CORS_ORIGIN: Tu dominio de Easypanel"
Write-Host "  - DATABASE_URL: De la BD de Easypanel"

# =============================================================================
# STEP 4: Verify Project Structure
# =============================================================================

Write-Host ""
Write-Host "[4/6] Verificando estructura del proyecto..." -ForegroundColor Yellow
Write-Host ""

$requiredFiles = @(
    "Dockerfile",
    "docker-compose.prod.yml",
    ".env.prod.example",
    "EASYPANEL_DEPLOYMENT.md",
    "EASYPANEL_CHECKLIST.md",
    "prisma/schema.prisma",
    "prisma/seed.js",
    "dev-server.js",
    "package.json"
)

$allFilesOk = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Success $file
    } else {
        Write-Error "$file (MISSING)"
        $allFilesOk = $false
    }
}

if ($allFilesOk) {
    Write-Success "Todos los archivos de deployment listos"
} else {
    Write-Error "Faltan archivos importantes"
    exit 1
}

# =============================================================================
# STEP 5: Check Git Status
# =============================================================================

Write-Host ""
Write-Host "[5/6] Verificando Git..." -ForegroundColor Yellow
Write-Host ""

# Check if Git repo exists
if (-not (Test-Path ".git")) {
    Write-Warning "No es un repositorio Git. Inicializando..."
    git init
}

# Check .gitignore for .env.prod
$gitignoreExists = Test-Path ".gitignore"
if ($gitignoreExists) {
    $gitignoreContent = Get-Content ".gitignore"
    if ($gitignoreContent -match "\.env\.prod") {
        Write-Success ".env.prod está en .gitignore"
    } else {
        Write-Warning "Agregando .env.prod a .gitignore"
        Add-Content ".gitignore" ".env.prod"
    }
} else {
    Write-Warning "Creando .gitignore con .env.prod"
    ".env.prod" | Out-File ".gitignore" -Encoding UTF8
}

# Check Git status
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Warning "Hay cambios sin commitear"
    Write-Host ($gitStatus | Out-String)
} else {
    Write-Success "Repositorio sincronizado"
}

# =============================================================================
# STEP 6: Summary and Next Steps
# =============================================================================

Write-Host ""
Write-Host "[6/6] Resumen y próximos pasos..." -ForegroundColor Yellow

Write-Header "✓ PREPARACIÓN COMPLETA"

Write-Host ""
Write-Host "📋 ARCHIVOS GENERADOS:" -ForegroundColor Cyan
Write-Host "  • .env.prod (con secretos generados)"
Write-Host "  • Dockerfile (multi-stage optimizado)"
Write-Host "  • docker-compose.prod.yml (configuración)"
Write-Host "  • EASYPANEL_DEPLOYMENT.md (guía completa)"
Write-Host "  • EASYPANEL_CHECKLIST.md (checklist)"
Write-Host ""

Write-Host "🔐 SECRETOS GENERADOS:" -ForegroundColor Cyan
Write-Host "  JWT_SECRET:"
Write-Host "    $JWT_SECRET" -ForegroundColor White
Write-Host "  JWT_REFRESH_SECRET:"
Write-Host "    $JWT_REFRESH_SECRET" -ForegroundColor White
Write-Host ""

Write-Host "⚡ PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Editar archivo .env.prod:" -ForegroundColor White
Write-Host "     notepad .env.prod  # o tu editor favorito" -ForegroundColor Yellow
Write-Host "     - Cambiar CORS_ORIGIN a tu dominio"
Write-Host "     - Dejar DATABASE_URL vacio (se configura en Easypanel)"
Write-Host ""
Write-Host "  2. Commitear cambios:" -ForegroundColor White
Write-Host "     git add ." -ForegroundColor Yellow
Write-Host "     git commit -m 'chore: prepare for easypanel deployment'" -ForegroundColor Yellow
Write-Host "     git push origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "  3. En Easypanel Dashboard:" -ForegroundColor White
Write-Host "     - Conectar GitHub repo"
Write-Host "     - Agregar variables desde .env.prod"
Write-Host "     - Crear PostgreSQL 15"
Write-Host "     - Deploy"
Write-Host ""
Write-Host "  4. Después del Deploy:" -ForegroundColor White
Write-Host "     - Verificar health check"
Write-Host "     - Ejecutar: npm run db:setup" -ForegroundColor Yellow
Write-Host "     - Test: curl https://tu-dominio.com/api/db-status" -ForegroundColor Yellow
Write-Host ""

Write-Host "📚 DOCUMENTACIÓN:" -ForegroundColor Cyan
Write-Host "  • Guía completa: EASYPANEL_DEPLOYMENT.md"
Write-Host "  • Checklist: EASYPANEL_CHECKLIST.md"
Write-Host "  • Configuración: .env.prod.example"
Write-Host ""

Write-Host "✅ ¡Listo para Easypanel!" -ForegroundColor Green
Write-Host ""
