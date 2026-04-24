import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ListRestaurantsDto } from './dto/list-restaurants.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RestaurantsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    return this.prisma.restaurant.create({
      data: {
        name: createRestaurantDto.name,
        email: createRestaurantDto.email || '',
        phone: createRestaurantDto.phone,
        websiteUrl: createRestaurantDto.website,
        cuisineType: createRestaurantDto.cuisineType,
        description: createRestaurantDto.description,
        ownerId: '',
      },
    });
  }

  async findAll(listRestaurantsDto: ListRestaurantsDto) {
    const limit = Math.min(parseInt(listRestaurantsDto.limit || '10'), 100);
    const offset = parseInt(listRestaurantsDto.offset || '0');

    const where: Prisma.RestaurantWhereInput = {};

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

  async findById(id: string) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        locations: true,
        categories: true,
      },
    });
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    return this.prisma.restaurant.update({
      where: { id },
      data: updateRestaurantDto,
    });
  }

  async delete(id: string) {
    return this.prisma.restaurant.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async exists(id: string): Promise<boolean> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!restaurant;
  }
}
