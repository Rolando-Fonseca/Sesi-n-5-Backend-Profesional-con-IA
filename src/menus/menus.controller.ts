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
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ListMenusDto } from './dto/list-menus.dto';
import { MenuResponseDto } from './dto/menu-response.dto';

/**
 * MenusController
 * 
 * Gestiona las ubicaciones/menús de cada restaurante.
 * Un restaurante puede tener múltiples ubicaciones.
 * 
 * Ver: api_contracts.md - Sección Locations
 */
@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  @ApiOperation({ summary: 'List all menus/locations' })
  @ApiResponse({ status: 200, description: 'Menus retrieved successfully', type: MenuResponseDto, isArray: true })
  async findAll(@Query() listMenusDto: ListMenusDto) {
    return this.menusService.findAll(listMenusDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu by ID' })
  @ApiResponse({ status: 200, description: 'Menu retrieved successfully', type: MenuResponseDto })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  async findById(@Param('id') id: string) {
    return this.menusService.findById(id);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new menu/location' })
  @ApiResponse({ status: 201, description: 'Menu created successfully', type: MenuResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update menu' })
  @ApiResponse({ status: 200, description: 'Menu updated successfully', type: MenuResponseDto })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  async update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menusService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete menu' })
  @ApiResponse({ status: 200, description: 'Menu deleted successfully' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  async delete(@Param('id') id: string) {
    return this.menusService.delete(id);
  }
}
