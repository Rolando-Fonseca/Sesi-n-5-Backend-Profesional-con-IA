import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ListMenusDto } from './dto/list-menus.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenusRepository {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    return this.prisma.location.create({
      data: {
        restaurantId: createMenuDto.restaurantId,
        name: createMenuDto.name,
        description: createMenuDto.description,
        address: createMenuDto.address || '',
        city: createMenuDto.city || '',
        state: createMenuDto.state,
        zipCode: createMenuDto.zipCode,
      },
    });
  }

  async findAll(listMenusDto: ListMenusDto) {
    const limit = Math.min(parseInt(listMenusDto.limit || '10'), 100);
    const offset = parseInt(listMenusDto.offset || '0');

    const where: Prisma.LocationWhereInput = {
      // deletedAt: null, (soft deletes not in schema)
    };

    if (listMenusDto.restaurantId) {
      where.restaurantId = listMenusDto.restaurantId;
    }

    if (listMenusDto.search) {
      where.OR = [
        { name: { contains: listMenusDto.search, mode: 'insensitive' } },
        { description: { contains: listMenusDto.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.location.findMany({
        where,
        take: limit,
        skip: offset,
        include: { restaurant: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.location.count({ where }),
    ]);

    return { items, total, limit, offset, pages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.prisma.location.findUnique({
      where: { id },
      include: {
        restaurant: true,
        dishes: {
          where: { deletedAt: null },
        },
      },
    });
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    return this.prisma.location.update({
      where: { id },
      data: updateMenuDto,
    });
  }

  async delete(id: string) {
    return this.prisma.location.update({
      where: { id },
      data: { isAvailable: false }, // soft delete simulation
    });
  }

  async exists(id: string): Promise<boolean> {
    const menu = await this.prisma.location.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!menu && menu.deletedAt === null;
  }
}
