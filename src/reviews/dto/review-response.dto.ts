import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty({
    description: 'Review ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Restaurant ID',
    example: '223e4567-e89b-12d3-a456-426614174000',
  })
  restaurantId: string;

  @ApiProperty({
    description: 'User ID',
    example: '323e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Rating (1-5)',
    example: 4,
  })
  rating: number;

  @ApiProperty({
    description: 'Review title',
    example: 'Excellent food and service',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Review content',
  })
  comment?: string;

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
