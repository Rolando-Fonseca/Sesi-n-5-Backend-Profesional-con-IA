/**
 * Development Server - Demostrando Docker + Prisma funcionando
 * Este es un servidor simple para verificar que la BD está conectada
 */

const { PrismaClient } = require('@prisma/client');
const express = require('express');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Middleware
app.use(express.json());

// Health check - verifica que el servidor está corriendo
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Test BD - verifique que Prisma puede conectar a BD
app.get('/api/db-status', async (req, res) => {
  try {
    // Intenta una query simple
    const count = await prisma.restaurant.count();
    res.json({
      status: 'CONNECTED',
      message: 'Database connection successful',
      restaurantCount: count,
      database: 'PostgreSQL (Docker)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// Lista todos los restaurantes
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      take: 10,
    });
    res.json({
      status: 'OK',
      message: 'Restaurants retrieved',
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
});

// Crea un nuevo restaurante
app.post('/api/restaurants', async (req, res) => {
  try {
    const { name, phone, email, cuisineType, description, website } = req.body;

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        phone,
        email: email || '',
        cuisineType,
        description: description || '',
        website: website || '',
      },
    });

    res.status(201).json({
      status: 'CREATED',
      message: 'Restaurant created successfully',
      data: restaurant,
    });
  } catch (error) {
    res.status(400).json({
      status: 'ERROR',
      message: error.message,
    });
  }
});

// Obtiene un restaurante por ID
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.params.id },
      include: {
        locations: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Restaurant not found',
      });
    }

    res.json({
      status: 'OK',
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
});

// API Info
app.get('/api', (req, res) => {
  res.json({
    name: 'Restaurants Backend API',
    version: '0.3.0-dev',
    mode: 'Development',
    database: 'PostgreSQL (Docker)',
    status: 'RUNNING',
    endpoints: {
      health: 'GET /health',
      'db-status': 'GET /api/db-status',
      restaurants: {
        list: 'GET /api/restaurants',
        create: 'POST /api/restaurants',
        get: 'GET /api/restaurants/:id',
      },
    },
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    status: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log('✅ Development Server started');
  console.log(`📍 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`🌐 API Base: http://localhost:${PORT}/api`);
  console.log('');
  console.log('Prueba la conexión BD:');
  console.log(`  curl http://localhost:${PORT}/api/db-status`);
  console.log('');
  console.log('Endpoints disponibles:');
  console.log(`  GET  http://localhost:${PORT}/api/restaurants`);
  console.log(`  POST http://localhost:${PORT}/api/restaurants`);
  console.log(`  GET  http://localhost:${PORT}/api/restaurants/:id`);
  console.log('');

  // Verificar conexión a BD al iniciar
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Base de datos conectada correctamente');
    console.log('');
  } catch (error) {
    console.error('❌ Error al conectar a base de datos:');
    console.error(error.message);
  }
});

// Manejar cierre gracioso
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});
