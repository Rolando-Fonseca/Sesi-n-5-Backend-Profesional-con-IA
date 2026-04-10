import { IsString, IsOptional, IsUUID, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Restaurant ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  restaurantId: string;

  @ApiProperty({
    description: 'User ID',
    example: '223e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Rating from 1 to 5',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiProperty({
    description: 'Review title',
    example: 'Excellent food and service',
    minLength: 5,
    maxLength: 100,
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed review content',
    example: 'The pasta was amazing and the staff was very friendly...',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
