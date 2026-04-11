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
        locationId: createMenuItemDto.locationId,
        name: createMenuItemDto.name,
        description: createMenuItemDto.description,
        price: createMenuItemDto.price,
        category: createMenuItemDto.category,
        availability: createMenuItemDto.availability || 'available',
        imageUrl: createMenuItemDto.imageUrl,
      },
    });
  }

  async findAll(listMenuItemsDto: ListMenuItemsDto) {
    const limit = Math.min(parseInt(listMenuItemsDto.limit || '10'), 100);
    const offset = parseInt(listMenuItemsDto.offset || '0');

    const where: Prisma.DishWhereInput = {
      // deletedAt: null, (soft deletes not in schema)
    };

    if (listMenuItemsDto.locationId) {
      where.locationId = listMenuItemsDto.locationId;
    }

    if (listMenuItemsDto.search) {
      where.OR = [
        { name: { contains: listMenuItemsDto.search, mode: 'insensitive' } },
        { description: { contains: listMenuItemsDto.search, mode: 'insensitive' } },
      ];
    }

    if (listMenuItemsDto.category) {
      where.category = {
        equals: listMenuItemsDto.category,
        mode: 'insensitive',
      };
    }

    if (listMenuItemsDto.availability) {
      where.availability = listMenuItemsDto.availability;
    }

    const [items, total] = await Promise.all([
      this.prisma.dish.findMany({
        where,
        take: limit,
        skip: offset,
        include: { location: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.dish.count({ where }),
    ]);

    return { items, total, limit, offset, pages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.prisma.dish.findUnique({
      where: { id },
      include: { location: { include: { restaurant: true } } },
    });
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    return this.prisma.dish.update({
      where: { id },
      data: updateMenuItemDto,
    });
  }

  async delete(id: string) {
    return this.prisma.dish.update({
      where: { id },
      data: { isAvailable: false }, // soft delete simulation
    });
  }

  async exists(id: string): Promise<boolean> {
    const item = await this.prisma.dish.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!item && item.deletedAt === null;
  }
}
