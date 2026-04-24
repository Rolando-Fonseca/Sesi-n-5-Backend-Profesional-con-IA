import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { ListMenuItemsDto } from './dto/list-menu-items.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuItemsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    return this.prisma.dish.create({
      data: {
        categoryId: createMenuItemDto.locationId,
        restaurantId: createMenuItemDto.locationId,
        name: createMenuItemDto.name,
        description: createMenuItemDto.description,
        price: createMenuItemDto.price,
        imageUrl: createMenuItemDto.imageUrl,
        isAvailable: createMenuItemDto.availability !== 'unavailable',
      },
    });
  }

  async findAll(listMenuItemsDto: ListMenuItemsDto) {
    const limit = Math.min(parseInt(listMenuItemsDto.limit || '10'), 100);
    const offset = parseInt(listMenuItemsDto.offset || '0');

    const where: Prisma.DishWhereInput = {};

    if (listMenuItemsDto.locationId) {
      where.categoryId = listMenuItemsDto.locationId;
    }

    if (listMenuItemsDto.search) {
      where.OR = [
        { name: { contains: listMenuItemsDto.search, mode: 'insensitive' } },
        { description: { contains: listMenuItemsDto.search, mode: 'insensitive' } },
      ];
    }

    if (listMenuItemsDto.category) {
      where.category = {
        name: { equals: listMenuItemsDto.category, mode: 'insensitive' },
      };
    }

    if (listMenuItemsDto.availability) {
      where.isAvailable = listMenuItemsDto.availability !== 'unavailable';
    }

    const [items, total] = await Promise.all([
      this.prisma.dish.findMany({
        where,
        take: limit,
        skip: offset,
        include: { category: true, restaurant: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.dish.count({ where }),
    ]);

    return { items, total, limit, offset, pages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.prisma.dish.findUnique({
      where: { id },
      include: { category: { include: { restaurant: true } } },
    });
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    const data: Prisma.DishUncheckedUpdateInput = {};

    if (updateMenuItemDto.name !== undefined) data.name = updateMenuItemDto.name;
    if (updateMenuItemDto.description !== undefined) data.description = updateMenuItemDto.description;
    if (updateMenuItemDto.price !== undefined) data.price = updateMenuItemDto.price;
    if (updateMenuItemDto.imageUrl !== undefined) data.imageUrl = updateMenuItemDto.imageUrl;
    if (updateMenuItemDto.availability !== undefined) data.isAvailable = updateMenuItemDto.availability !== 'unavailable';
    if (updateMenuItemDto.locationId !== undefined) data.categoryId = updateMenuItemDto.locationId;

    return this.prisma.dish.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.dish.update({
      where: { id },
      data: { isAvailable: false },
    });
  }

  async exists(id: string): Promise<boolean> {
    const item = await this.prisma.dish.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!item;
  }
}
