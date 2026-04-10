import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RestaurantsRepository } from './restaurants.repository';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ListRestaurantsDto } from './dto/list-restaurants.dto';

/**
 * RestaurantsService
 * 
 * Capa de lógica de negocio para restaurantes.
 * Coordina entre controlador y repositorio, implementando reglas de negocio.
 * 
 * Responsabilidades:
 * - Validación de reglas de negocio
 * - Orquestación de operaciones
 * - Manejo de errores de negocio
 * - Transformación de datos
 * 
 * Ver: architecture_nest.md - Sección Service Layer
 * Ver: db_model.md - Sección Business Rules
 */
@Injectable()
export class RestaurantsService {
  constructor(private restaurantsRepository: RestaurantsRepository) {}

  /**
   * Crear un nuevo restaurante
   * 
   * Validaciones:
   * - Nombre debe ser único (restricción de BD)
   * - Email debe ser válido (validado en DTO)
   * - Teléfono debe ser válido (validado en DTO)
   * 
   * @param createRestaurantDto - Datos del nuevo restaurante
   * @returns El restaurante creado
   * @throws BadRequestException si los datos son inválidos
   */
  async create(createRestaurantDto: CreateRestaurantDto) {
    try {
      const restaurant = await this.restaurantsRepository.create(createRestaurantDto);
      return {
        statusCode: 201,
        message: 'Restaurant created successfully',
        data: restaurant,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('A restaurant with this email already exists');
      }
      throw error;
    }
  }

  /**
   * Obtener lista de restaurantes con filtrado
   * 
   * @param listRestaurantsDto - Parámetros de búsqueda y paginación
   * @returns Lista paginada de restaurantes
   */
  async findAll(listRestaurantsDto: ListRestaurantsDto) {
    const result = await this.restaurantsRepository.findAll(listRestaurantsDto);

    return {
      statusCode: 200,
      message: 'Restaurants retrieved successfully',
      data: result.items,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        pages: result.pages,
        currentPage: Math.floor(result.offset / result.limit) + 1,
      },
    };
  }

  /**
   * Obtener un restaurante por ID
   * 
   * @param id - ID del restaurante
   * @returns El restaurante con sus relaciones
   * @throws NotFoundException si el restaurante no existe
   */
  async findById(id: string) {
    const restaurant = await this.restaurantsRepository.findById(id);

    if (!restaurant || restaurant.deletedAt) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    return {
      statusCode: 200,
      message: 'Restaurant retrieved successfully',
      data: restaurant,
    };
  }

  /**
   * Actualizar un restaurante
   * 
   * @param id - ID del restaurante
   * @param updateRestaurantDto - Datos a actualizar
   * @returns El restaurante actualizado
   * @throws NotFoundException si el restaurante no existe
   */
  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    const exists = await this.restaurantsRepository.exists(id);

    if (!exists) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    try {
      const restaurant = await this.restaurantsRepository.update(id, updateRestaurantDto);
      return {
        statusCode: 200,
        message: 'Restaurant updated successfully',
        data: restaurant,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('A restaurant with this email already exists');
      }
      throw error;
    }
  }

  /**
   * Eliminar un restaurante (soft delete)
   * 
   * @param id - ID del restaurante
   * @returns Mensaje de confirmación
   * @throws NotFoundException si el restaurante no existe
   */
  async delete(id: string) {
    const exists = await this.restaurantsRepository.exists(id);

    if (!exists) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    await this.restaurantsRepository.delete(id);

    return {
      statusCode: 200,
      message: 'Restaurant deleted successfully',
    };
  }
}
