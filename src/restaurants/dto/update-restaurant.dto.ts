import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';

/**
 * UpdateRestaurantDto
 * 
 * DTO para actualizar un restaurante existente.
 * Todos los campos son opcionales para permitir actualizaciones parciales.
 * 
 * Ver: api_contracts.md - PUT /restaurants/:id
 */
export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
