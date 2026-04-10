-- Script de inicialización para PostgreSQL
-- Este script se ejecuta automáticamente al crear el contenedor

-- Crear extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear esquema público (si no existe)
CREATE SCHEMA IF NOT EXISTS public;

-- Cambiar al esquema público
SET search_path TO public;

-- Log de inicialización
SELECT 'Database initialization started' AS status;

-- Crear tipos ENUM para roles de usuario
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'STAFF', 'ADMIN');

-- Crear tipos ENUM para estados
CREATE TYPE table_status AS ENUM ('AVAILABLE', 'RESERVED', 'OCCUPIED');
CREATE TYPE reservation_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'CANCELLED');
CREATE TYPE order_type AS ENUM ('DINE_IN', 'TAKEOUT', 'DELIVERY');

-- Log de finalización
SELECT 'Database initialization completed' AS status;
