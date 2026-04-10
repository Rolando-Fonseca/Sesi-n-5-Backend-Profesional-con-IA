import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MenusRepository } from './menus.repository';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ListMenusDto } from './dto/list-menus.dto';

@Injectable()
export class MenusService {
  constructor(private menusRepository: MenusRepository) {}

  async create(createMenuDto: CreateMenuDto) {
    try {
      const menu = await this.menusRepository.create(createMenuDto);
      return {
        statusCode: 201,
        message: 'Menu created successfully',
        data: menu,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('A menu with this name already exists for this restaurant');
      }
      throw error;
    }
  }

  async findAll(listMenusDto: ListMenusDto) {
    const result = await this.menusRepository.findAll(listMenusDto);
    return {
      statusCode: 200,
      message: 'Menus retrieved successfully',
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
    const menu = await this.menusRepository.findById(id);
    if (!menu || menu.deletedAt) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }
    return {
      statusCode: 200,
      message: 'Menu retrieved successfully',
      data: menu,
    };
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const exists = await this.menusRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }

    try {
      const menu = await this.menusRepository.update(id, updateMenuDto);
      return {
        statusCode: 200,
        message: 'Menu updated successfully',
        data: menu,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('A menu with this name already exists for this restaurant');
      }
      throw error;
    }
  }

  async delete(id: string) {
    const exists = await this.menusRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }
    await this.menusRepository.delete(id);
    return {
      statusCode: 200,
      message: 'Menu deleted successfully',
    };
  }
}
