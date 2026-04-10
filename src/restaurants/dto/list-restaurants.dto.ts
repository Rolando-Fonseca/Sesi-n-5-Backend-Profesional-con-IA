import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * ListRestaurantsDto
 * 
 * DTO para filtrar y buscar restaurantes en la lista.
 * Parámetros de query para GET /restaurants.
 * 
 * Soporta:
 * - search: Búsqueda por nombre o descripción
 * - cuisineType: Filtro por tipo de cocina
 * - limit: Número máximo de resultados
 * - offset: Número de resultados a saltar (paginación)
 * 
 * Ver: api_contracts.md - GET /restaurants?search=...&limit=10&offset=0
 */
export class ListRestaurantsDto {
  @ApiPropertyOptional({
    description: 'Search by restaurant name or description',
    example: 'Bella Italia',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by cuisine type',
    example: 'Italian',
    enum: ['Italian', 'Mexican', 'Asian', 'American', 'French', 'Spanish', 'Indian', 'Other'],
  })
  @IsOptional()
  @IsString()
  cuisineType?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results (default: 10, max: 100)',
    example: '10',
    default: '10',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    description: 'Number of results to skip for pagination (default: 0)',
    example: '0',
    default: '0',
  })
  @IsOptional()
  @IsNumberString()
  offset?: string;
}
