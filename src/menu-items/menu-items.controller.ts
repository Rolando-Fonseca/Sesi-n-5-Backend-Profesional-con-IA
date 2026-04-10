import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { ListMenuItemsDto } from './dto/list-menu-items.dto';
import { MenuItemResponseDto } from './dto/menu-item-response.dto';

/**
 * MenuItemsController
 * 
 * Gestiona los platos/items de cada menú.
 * 
 * Ver: api_contracts.md - Sección Dishes
 */
@ApiTags('Menu Items')
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  @ApiOperation({ summary: 'List all menu items' })
  @ApiResponse({ status: 200, description: 'Menu items retrieved successfully', type: MenuItemResponseDto, isArray: true })
  async findAll(@Query() listMenuItemsDto: ListMenuItemsDto) {
    return this.menuItemsService.findAll(listMenuItemsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu item by ID' })
  @ApiResponse({ status: 200, description: 'Menu item retrieved successfully', type: MenuItemResponseDto })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async findById(@Param('id') id: string) {
    return this.menuItemsService.findById(id);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new menu item' })
  @ApiResponse({ status: 201, description: 'Menu item created successfully', type: MenuItemResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update menu item' })
  @ApiResponse({ status: 200, description: 'Menu item updated successfully', type: MenuItemResponseDto })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemsService.update(id, updateMenuItemDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete menu item' })
  @ApiResponse({ status: 200, description: 'Menu item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async delete(@Param('id') id: string) {
    return this.menuItemsService.delete(id);
  }
}
