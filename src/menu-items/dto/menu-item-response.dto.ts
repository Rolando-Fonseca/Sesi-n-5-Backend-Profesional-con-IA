import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MenuItemResponseDto {
  @ApiProperty({
    description: 'Dish ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Location/Menu ID',
    example: '223e4567-e89b-12d3-a456-426614174000',
  })
  locationId: string;

  @ApiProperty({
    description: 'Dish name',
    example: 'Spaghetti Carbonara',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Dish description',
  })
  description?: string;

  @ApiProperty({
    description: 'Dish price',
    example: 18.99,
  })
  price: number;

  @ApiPropertyOptional({
    description: 'Category',
  })
  category?: string;

  @ApiPropertyOptional({
    description: 'Availability status',
  })
  availability?: string;

  @ApiPropertyOptional({
    description: 'Image URL',
  })
  imageUrl?: string;

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
}
