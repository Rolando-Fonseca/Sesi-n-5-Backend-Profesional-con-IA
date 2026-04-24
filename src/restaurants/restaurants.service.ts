import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RestaurantsRepository } from './restaurants.repository';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ListRestaurantsDto } from './dto/list-restaurants.dto';

@Injectable()
export class RestaurantsService {
  constructor(private restaurantsRepository: RestaurantsRepository) {}

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
        throw new BadRequestException('A restaurant with this name already exists');
      }
      throw error;
    }
  }

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

  async findById(id: string) {
    const restaurant = await this.restaurantsRepository.findById(id);

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    return {
      statusCode: 200,
      message: 'Restaurant retrieved successfully',
      data: restaurant,
    };
  }

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
        throw new BadRequestException('A restaurant with this name already exists');
      }
      throw error;
    }
  }

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
