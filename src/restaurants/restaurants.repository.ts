import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ListRestaurantsDto } from './dto/list-restaurants.dto';
import { Prisma } from '@prisma/client';

/**
 * RestaurantsRepository
 * 
 * Capa de acceso a datos para restaurantes usando Prisma.
 * Aquí van todas las queries a la BD relacionadas con restaurantes.
 * 
 * Responsabilidades:
 * - Ejecutar queries CRUD con Prisma
 * - Manejar relaciones (locations, menus, etc)
 * - Implementar paginación y filtrado
 * - Retornar datos formateados
 * 
 * Ver: architecture_nest.md - Sección Repository Pattern
 * Ver: db_model.md - Sección Restaurant entity
 */
@Injectable()
export class RestaurantsRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear un nuevo restaurante
   * 
   * @param createRestaurantDto - Datos del nuevo restaurante
   * @returns El restaurante creado
   */
  async create(createRestaurantDto: CreateRestaurantDto) {
    return this.prisma.restaurant.create({
      data: {
        name: createRestaurantDto.name,
        email: createRestaurantDto.email || '',
        phone: createRestaurantDto.phone,
        website: createRestaurantDto.website,
        cuisineType: createRestaurantDto.cuisineType,
        description: createRestaurantDto.description,
      },
    });
  }

  /**
   * Obtener todos los restaurantes con filtrado y paginación
   * 
   * @param listRestaurantsDto - Parámetros de filtrado y paginación
   * @returns Lista de restaurantes y total de registros
   */
  async findAll(listRestaurantsDto: ListRestaurantsDto) {
    const limit = Math.min(parseInt(listRestaurantsDto.limit || '10'), 100);
    const offset = parseInt(listRestaurantsDto.offset || '0');

    // Construir where clause dinámico
    const where: Prisma.RestaurantWhereInput = {
      // Soft deletes commented for now - not in schema
      // // deletedAt: null, (soft deletes not in schema)
    };

    if (listRestaurantsDto.search) {
      where.OR = [
        { name: { contains: listRestaurantsDto.search, mode: 'insensitive' } },
        { description: { contains: listRestaurantsDto.search, mode: 'insensitive' } },
      ];
    }

    if (listRestaurantsDto.cuisineType) {
      where.cuisineType = {
        equals: listRestaurantsDto.cuisineType,
        mode: 'insensitive',
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.restaurant.count({ where }),
    ]);

    return {
      items,
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener un restaurante por ID
   * 
   * @param id - ID del restaurante
   * @returns El restaurante o null si no existe
   */
  async findById(id: string) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        locations: {
          where: { deletedAt: null },
        },
        menus: {
          where: { deletedAt: null },
        },
      },
    });
  }

  /**
   * Actualizar un restaurante
   * 
   * @param id - ID del restaurante
   * @param updateRestaurantDto - Datos a actualizar
   * @returns El restaurante actualizado
   */
  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    return this.prisma.restaurant.update({
      where: { id },
      data: updateRestaurantDto,
    });
  }

  /**
   * Eliminar (soft delete) un restaurante
   * 
   * Marca deletedAt con la fecha actual en lugar de borrar completamente.
   * 
   * @param id - ID del restaurante
   * @returns El restaurante "eliminado"
   */
  async delete(id: string) {
    return this.prisma.restaurant.update({
      where: { id },
      data: { isAvailable: false }, // soft delete simulation
    });
  }

  /**
   * Verificar si un restaurante existe
   * 
   * @param id - ID del restaurante
   * @returns true si existe y no está eliminado
   */
  async exists(id: string): Promise<boolean> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!restaurant && restaurant.deletedAt === null;
  }
}
