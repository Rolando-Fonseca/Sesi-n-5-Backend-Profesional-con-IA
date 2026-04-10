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
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { RestaurantsService } from "./restaurants.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { ListRestaurantsDto } from "./dto/list-restaurants.dto";
import { RestaurantResponseDto } from "./dto/restaurant-response.dto";
import { AuthGuard } from "../common/guards/auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";

/**
 * RestaurantsController
 *
 * Endpoints para gestión completa de restaurantes (CRUD).
 * Todos los endpoints están documentados con Swagger decorators.
 *
 * Endpoints:
 * - GET /restaurants - Listar con filtrado
 * - GET /restaurants/:id - Obtener por ID
 * - POST /restaurants - Crear nuevo
 * - PUT /restaurants/:id - Actualizar
 * - DELETE /restaurants/:id - Eliminar
 *
 * Ver: api_contracts.md - Sección Restaurants
 */
@ApiTags("Restaurants")
@Controller("restaurants")
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  /**
   * GET /restaurants
   * Obtener lista de restaurantes con soporte para búsqueda y paginación
   *
   * Parámetros de query:
   * - search: Buscar por nombre o descripción (opcional)
   * - cuisineType: Filtrar por tipo de cocina (opcional)
   * - limit: Máximo de resultados (default: 10, max: 100)
   * - offset: Saltar N resultados para paginación (default: 0)
   *
   * Query example:
   * GET /restaurants?search=Bella&cuisineType=Italian&limit=10&offset=0
   *
   * Respuesta (200 OK):
   * {
   *   "statusCode": 200,
   *   "message": "Restaurants retrieved successfully",
   *   "data": [ { id, name, email, phone, ... } ],
   *   "pagination": { total: 50, limit: 10, offset: 0, pages: 5, currentPage: 1 }
   * }
   */
  @Get()
  @ApiOperation({
    summary: "List all restaurants",
    description: "Get paginated list of restaurants with filtering and search",
  })
  @ApiResponse({
    status: 200,
    description: "List of restaurants retrieved successfully",
    type: RestaurantResponseDto,
    isArray: true,
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search by name or description",
  })
  @ApiQuery({
    name: "cuisineType",
    required: false,
    description: "Filter by cuisine type",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Max results (default: 10)",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Pagination offset (default: 0)",
  })
  async findAll(@Query() listRestaurantsDto: ListRestaurantsDto) {
    return this.restaurantsService.findAll(listRestaurantsDto);
  }

  /**
   * GET /restaurants/:id
   * Obtener un restaurante específico por ID
   *
   * Parámetro de path:
   * - id: UUID del restaurante
   *
   * Path example:
   * GET /restaurants/123e4567-e89b-12d3-a456-426614174000
   *
   * Respuesta (200 OK):
   * {
   *   "statusCode": 200,
   *   "message": "Restaurant retrieved successfully",
   *   "data": { id, name, email, phone, locations: [], menus: [], ... }
   * }
   *
   * Error (404 Not Found):
   * {
   *   "statusCode": 404,
   *   "message": "Not Found",
   *   "error": "Restaurant with id ... not found"
   * }
   */
  @Get(":id")
  @ApiOperation({
    summary: "Get restaurant by ID",
    description: "Retrieve a specific restaurant with all its related data",
  })
  @ApiResponse({
    status: 200,
    description: "Restaurant retrieved successfully",
    type: RestaurantResponseDto,
  })
  @ApiResponse({ status: 404, description: "Restaurant not found" })
  async findById(@Param("id") id: string) {
    return this.restaurantsService.findById(id);
  }

  /**
   * POST /restaurants
   * Crear un nuevo restaurante
   *
   * Body (JSON):
   * {
   *   "name": "Bella Italia",
   *   "email": "info@bellaitalia.com",
   *   "phone": "+1-555-123-4567",
   *   "website": "https://bellaitalia.com",
   *   "cuisineType": "Italian",
   *   "description": "Fine dining Italian restaurant..."
   * }
   *
   * Respuesta (201 Created):
   * {
   *   "statusCode": 201,
   *   "message": "Restaurant created successfully",
   *   "data": { id, name, email, ... }
   * }
   *
   * Error (400 Bad Request):
   * {
   *   "statusCode": 400,
   *   "message": "Bad Request",
   *   "error": "A restaurant with this email already exists"
   * }
   *
   * Validaciones (DTO):
   * - name: string, length 3-100 (requerido)
   * - email: email válido (opcional)
   * - phone: string, length 10-20 (requerido)
   * - website: URL válida (opcional)
   * - cuisineType: string (requerido)
   * - description: string, max 500 (opcional)
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: "Create new restaurant",
    description: "Create a new restaurant with provided information",
  })
  @ApiResponse({
    status: 201,
    description: "Restaurant created successfully",
    type: RestaurantResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad Request - Invalid data" })
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  /**
   * PUT /restaurants/:id
   * Actualizar un restaurante existente
   *
   * Parámetro de path:
   * - id: UUID del restaurante
   *
   * Body (JSON) - Todos los campos son opcionales:
   * {
   *   "name": "Bella Italia Updated",
   *   "email": "newemail@bellaitalia.com",
   *   // ... otros campos opcionales
   * }
   *
   * Respuesta (200 OK):
   * {
   *   "statusCode": 200,
   *   "message": "Restaurant updated successfully",
   *   "data": { id, name, email, ... }
   * }
   *
   * Error (404 Not Found):
   * {
   *   "statusCode": 404,
   *   "message": "Not Found",
   *   "error": "Restaurant with id ... not found"
   * }
   */
  @Put(":id")
  @ApiOperation({
    summary: "Update restaurant",
    description: "Update a specific restaurant with partial or complete data",
  })
  @ApiResponse({
    status: 200,
    description: "Restaurant updated successfully",
    type: RestaurantResponseDto,
  })
  @ApiResponse({ status: 404, description: "Restaurant not found" })
  async update(
    @Param("id") id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  /**
   * DELETE /restaurants/:id
   * Eliminar un restaurante (soft delete)
   *
   * Nota: Se usa soft delete. El registro no se borra sino se marca como deleted_at = now()
   * Esto permite auditoría y recuperación de datos si es necesario.
   *
   * Parámetro de path:
   * - id: UUID del restaurante
   *
   * Respuesta (200 OK):
   * {
   *   "statusCode": 200,
   *   "message": "Restaurant deleted successfully"
   * }
   *
   * Error (404 Not Found):
   * {
   *   "statusCode": 404,
   *   "message": "Not Found",
   *   "error": "Restaurant with id ... not found"
   * }
   */
  @Delete(":id")
  @HttpCode(200)
  @ApiOperation({
    summary: "Delete restaurant",
    description:
      "Soft delete a restaurant (marks as deleted, does not remove from DB)",
  })
  @ApiResponse({ status: 200, description: "Restaurant deleted successfully" })
  @ApiResponse({ status: 404, description: "Restaurant not found" })
  async delete(@Param("id") id: string) {
    return this.restaurantsService.delete(id);
  }
}
