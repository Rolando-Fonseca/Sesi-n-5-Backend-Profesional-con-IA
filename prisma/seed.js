/**
 * Prisma Seed Script
 * Puebla la base de datos con datos de ejemplo para desarrollo
 * 
 * Ejecución:
 *   pnpm db:seed
 *   node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...\n');

  // Limpiar datos existentes (opcional, comentar si no quieres borrar)
  // await prisma.restaurant.deleteMany();
  // await prisma.user.deleteMany();
  // console.log('✓ Base de datos limpiada\n');

  // ============================================================================
  // 1. CREAR USUARIOS (Owners y Staff)
  // ============================================================================
  console.log('👥 Creando usuarios...');

  const user1 = await prisma.user.upsert({
    where: { email: 'marco@bellaitalia.com' },
    update: {},
    create: {
      email: 'marco@bellaitalia.com',
      password: 'hashed_password_123', // En producción usar bcrypt
      firstName: 'Marco',
      lastName: 'Rossi',
      phone: '+1-555-0001',
      role: 'STAFF',
      avatarUrl: 'https://api.example.com/avatars/marco.png',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'juan@tacos.com' },
    update: {},
    create: {
      email: 'juan@tacos.com',
      password: 'hashed_password_123',
      firstName: 'Juan',
      lastName: 'Hernández',
      phone: '+1-555-0002',
      role: 'ADMIN',
      avatarUrl: 'https://api.example.com/avatars/juan.png',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: {},
    create: {
      email: 'customer1@example.com',
      password: 'hashed_password_123',
      firstName: 'Carlos',
      lastName: 'García',
      phone: '+1-555-0003',
      role: 'CUSTOMER',
    },
  });

  console.log(`✓ ${user1.firstName} creado`);
  console.log(`✓ ${user2.firstName} creado`);
  console.log(`✓ ${user3.firstName} creado\n`);

  // ============================================================================
  // 2. CREAR RESTAURANTES
  // ============================================================================
  console.log('🍽️  Creando restaurantes...');

  const restaurant1 = await prisma.restaurant.upsert({
    where: { name: 'Bella Italia' },
    update: {},
    create: {
      name: 'Bella Italia',
      description: 'Auténtica cocina italiana con recetas tradicionales',
      cuisineType: 'Italian',
      phone: '+1-555-1001',
      email: 'info@bellaitalia.com',
      websiteUrl: 'https://bellaitalia.com',
      logoUrl: 'https://api.example.com/logos/bella-italia.png',
      rating: 4.8,
      isActive: true,
      ownerId: user1.id,
    },
  });

  const restaurant2 = await prisma.restaurant.upsert({
    where: { name: 'Tacos Mexicanos' },
    update: {},
    create: {
      name: 'Tacos Mexicanos',
      description: 'Los mejores tacos al pastor y comida mexicana auténtica',
      cuisineType: 'Mexican',
      phone: '+1-555-1002',
      email: 'info@tacos.com',
      websiteUrl: 'https://tacosmexicanos.com',
      logoUrl: 'https://api.example.com/logos/tacos.png',
      rating: 4.6,
      isActive: true,
      ownerId: user2.id,
    },
  });

  const restaurant3 = await prisma.restaurant.upsert({
    where: { name: 'Dragon Wok' },
    update: {},
    create: {
      name: 'Dragon Wok',
      description: 'Cocina asiática fusión con sabores del este',
      cuisineType: 'Asian',
      phone: '+1-555-1003',
      email: 'info@dragonwok.com',
      websiteUrl: 'https://dragonwok.com',
      logoUrl: 'https://api.example.com/logos/dragon-wok.png',
      rating: 4.4,
      isActive: true,
      ownerId: user2.id,
    },
  });

  console.log(`✓ ${restaurant1.name} creado`);
  console.log(`✓ ${restaurant2.name} creado`);
  console.log(`✓ ${restaurant3.name} creado\n`);

  // ============================================================================
  // 3. CREAR UBICACIONES
  // ============================================================================
  console.log('📍 Creando ubicaciones...');

  const location1 = await prisma.location.upsert({
    where: { id: `loc_${restaurant1.id}_main` },
    update: {},
    create: {
      id: `loc_${restaurant1.id}_main`,
      restaurantId: restaurant1.id,
      address: '123 Italian Ave',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      latitude: 40.7128,
      longitude: -74.006,
      openingTime: '11:00',
      closingTime: '23:00',
      isPrimary: true,
    },
  });

  const location2 = await prisma.location.upsert({
    where: { id: `loc_${restaurant2.id}_main` },
    update: {},
    create: {
      id: `loc_${restaurant2.id}_main`,
      restaurantId: restaurant2.id,
      address: '456 Mexican Street',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA',
      latitude: 34.0522,
      longitude: -118.2437,
      openingTime: '10:00',
      closingTime: '22:00',
      isPrimary: true,
    },
  });

  console.log(`✓ Ubicación de ${restaurant1.name} creada`);
  console.log(`✓ Ubicación de ${restaurant2.name} creada\n`);

  // ============================================================================
  // 4. CREAR CATEGORÍAS DE MENÚ
  // ============================================================================
  console.log('📂 Creando categorías...');

  const category1 = await prisma.category.upsert({
    where: { id: `cat_${restaurant1.id}_pasta` },
    update: {},
    create: {
      id: `cat_${restaurant1.id}_pasta`,
      restaurantId: restaurant1.id,
      name: 'Pasta',
      description: 'Deliciosas pastas italianas',
    },
  });

  const category2 = await prisma.category.upsert({
    where: { id: `cat_${restaurant2.id}_tacos` },
    update: {},
    create: {
      id: `cat_${restaurant2.id}_tacos`,
      restaurantId: restaurant2.id,
      name: 'Tacos',
      description: 'Auténticos tacos mexicanos',
    },
  });

  console.log(`✓ Categoría Pasta creada`);
  console.log(`✓ Categoría Tacos creada\n`);

  // ============================================================================
  // 5. CREAR PLATOS (DISHES)
  // ============================================================================
  console.log('🍝 Creando platos...');

  const dish1 = await prisma.dish.create({
    data: {
      name: 'Fettuccine Alfredo',
      description: 'Fettuccine con salsa de queso parmesano cremosa',
      price: 14.99,
      categoryId: category1.id,
      restaurantId: restaurant1.id,
      isAvailable: true,
      preparationTime: 15,
      imageUrl: 'https://api.example.com/dishes/fettuccine.jpg',
      ingredients: 'Fettuccine, queso parmesano, mantequilla, crema',
      allergens: 'Lácteos, Gluten',
    },
  });

  const dish2 = await prisma.dish.create({
    data: {
      name: 'Taco Al Pastor',
      description: 'Cerdo marinado con piñas en tortilla crujiente',
      price: 3.99,
      categoryId: category2.id,
      restaurantId: restaurant2.id,
      isAvailable: true,
      preparationTime: 10,
      imageUrl: 'https://api.example.com/dishes/taco-pastor.jpg',
      ingredients: 'Cerdo, piña, cebolla, cilantro, tortilla',
      allergens: 'Ninguno',
    },
  });

  console.log(`✓ ${dish1.name} creado`);
  console.log(`✓ ${dish2.name} creado\n`);

  // ============================================================================
  // 6. CREAR TABLAS
  // ============================================================================
  console.log('🪑 Creando tablas...');

  for (let i = 1; i <= 5; i++) {
    await prisma.table.upsert({
      where: { id: `table_${location1.id}_${i}` },
      update: {},
      create: {
        id: `table_${location1.id}_${i}`,
        locationId: location1.id,
        restaurantId: restaurant1.id,
        number: `T${i}`,
        capacity: i === 1 ? 2 : i === 2 ? 4 : i === 3 ? 6 : i === 4 ? 8 : 10,
        status: 'AVAILABLE',
      },
    });
  }

  console.log(`✓ 5 mesas creadas en ${restaurant1.name}\n`);

  // ============================================================================
  // Resumen
  // ============================================================================
  console.log('✅ Seed completado exitosamente!\n');
  console.log('📊 Datos creados:');
  console.log(`   • ${3} usuarios`);
  console.log(`   • ${3} restaurantes`);
  console.log(`   • ${2} ubicaciones`);
  console.log(`   • ${2} categorías`);
  console.log(`   • ${2} platos`);
  console.log(`   • ${5} mesas\n`);
  console.log('🚀 Próximos pasos:');
  console.log('   1. npm run start:dev (para iniciar el servidor)');
  console.log('   2. Visita http://localhost:3000/api/restaurants');
  console.log('   3. Revisa Swagger en http://localhost:3000/api\n');
}

main()
  .catch((e) => {
    console.error('❌ Error durante seed:\n', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
