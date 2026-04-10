import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsUrl, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateRestaurantDto
 * 
 * DTO para crear un nuevo restaurante.
 * Valida toda la información requiera según db_model.md.
 * 
 * Validaciones:
 * - name: Requerido, 3-100 caracteres
 * - email: Email válido (opcional para primera creación)
 * - phone: Teléfono internacional válido
 * - website: URL válida (opcional)
 * - cuisineType: Tipo de cocina (ej: Italian, Mexican, Asian)
 * - description: Descripción del restaurante (opcional)
 * 
 * Ver: api_contracts.md - POST /restaurants
 * Ver: db_model.md - Modelo Restaurant
 */
export class CreateRestaurantDto {
  @ApiProperty({
    description: 'Restaurant name',
    example: 'Bella Italia',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: "Restaurant's email address",
    example: 'info@bellaitalia.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1-555-123-4567',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phone: string;

  @ApiPropertyOptional({
    description: "Restaurant's website",
    example: 'https://bellaitalia.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'Type of cuisine',
    example: 'Italian',
    enum: ['Italian', 'Mexican', 'Asian', 'American', 'French', 'Spanish', 'Indian', 'Other'],
  })
  @IsString()
  cuisineType: string;

  @ApiPropertyOptional({
    description: 'Restaurant description',
    example: 'Fine dining Italian restaurant with traditional recipes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
