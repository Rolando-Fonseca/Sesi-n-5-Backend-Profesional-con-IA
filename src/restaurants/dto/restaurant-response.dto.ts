import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * RestaurantResponseDto
 * 
 * DTO para respuestas de restaurantes.
 * Se usa en todos los endpoints que retornan información de restaurante.
 * 
 * Ver: api_contracts.md - Response examples para endpoints de restaurantes
 */
export class RestaurantResponseDto {
  @ApiProperty({
    description: 'Unique restaurant identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Restaurant name',
    example: 'Bella Italia',
  })
  name: string;

  @ApiPropertyOptional({
    description: "Restaurant's email address",
    example: 'info@bellaitalia.com',
  })
  email?: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1-555-123-4567',
  })
  phone: string;

  @ApiPropertyOptional({
    description: "Restaurant's website",
    example: 'https://bellaitalia.com',
  })
  website?: string;

  @ApiProperty({
    description: 'Type of cuisine',
    example: 'Italian',
  })
  cuisineType: string;

  @ApiPropertyOptional({
    description: 'Restaurant description',
    example: 'Fine dining Italian restaurant with traditional recipes',
  })
  description?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-04-10T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-04-10T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Soft delete timestamp (null if not deleted)',
    example: null,
  })
  deletedAt?: Date | null;
}
