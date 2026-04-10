import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MenuResponseDto {
  @ApiProperty({
    description: 'Menu/Location ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Restaurant ID',
    example: '223e4567-e89b-12d3-a456-426614174000',
  })
  restaurantId: string;

  @ApiProperty({
    description: 'Menu name',
    example: 'Downtown Location',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Menu description',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Address',
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'City',
  })
  city?: string;

  @ApiPropertyOptional({
    description: 'State/Province',
  })
  state?: string;

  @ApiPropertyOptional({
    description: 'Zip/Postal code',
  })
  zipCode?: string;

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
