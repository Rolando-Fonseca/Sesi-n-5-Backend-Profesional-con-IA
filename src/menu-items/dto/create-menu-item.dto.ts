import { IsString, IsOptional, IsUUID, IsNumber, MinLength, MaxLength, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMenuItemDto {
  @ApiProperty({
    description: 'Location/Menu ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  locationId: string;

  @ApiProperty({
    description: 'Dish name',
    example: 'Spaghetti Carbonara',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Dish description',
    example: 'Traditional Italian pasta with eggs and bacon',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Dish price',
    example: 18.99,
    minimum: 0.01,
    maximum: 999999.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999.99)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({
    description: 'Category (appetizer, main course, dessert, etc)',
    example: 'Main Course',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Dish availability (available, unavailable, seasonal)',
    example: 'available',
    enum: ['available', 'unavailable', 'seasonal'],
  })
  @IsOptional()
  @IsString()
  availability?: string;

  @ApiPropertyOptional({
    description: 'URL to dish image',
    example: 'https://example.com/images/spaghetti-carbonara.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
