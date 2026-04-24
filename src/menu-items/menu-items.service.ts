import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MenuItemsRepository } from './menu-items.repository';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { ListMenuItemsDto } from './dto/list-menu-items.dto';

@Injectable()
export class MenuItemsService {
  constructor(private menuItemsRepository: MenuItemsRepository) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    try {
      const item = await this.menuItemsRepository.create(createMenuItemDto);
      return {
        statusCode: 201,
        message: 'Menu item created successfully',
        data: item,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('A menu item with this name already exists in this location');
      }
      throw error;
    }
  }

  async findAll(listMenuItemsDto: ListMenuItemsDto) {
    const result = await this.menuItemsRepository.findAll(listMenuItemsDto);
    return {
      statusCode: 200,
      message: 'Menu items retrieved successfully',
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
    const item = await this.menuItemsRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }
    return {
      statusCode: 200,
      message: 'Menu item retrieved successfully',
      data: item,
    };
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    const exists = await this.menuItemsRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    try {
      const item = await this.menuItemsRepository.update(id, updateMenuItemDto);
      return {
        statusCode: 200,
        message: 'Menu item updated successfully',
        data: item,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('A menu item with this name already exists in this location');
      }
      throw error;
    }
  }

  async delete(id: string) {
    const exists = await this.menuItemsRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }
    await this.menuItemsRepository.delete(id);
    return {
      statusCode: 200,
      message: 'Menu item deleted successfully',
    };
  }
}
