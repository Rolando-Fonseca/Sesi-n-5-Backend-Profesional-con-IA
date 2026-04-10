import { IsOptional, IsString, IsNumberString, IsUUID, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListReviewsDto {
  @ApiPropertyOptional({
    description: 'Filter by restaurant ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  restaurantId?: string;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: '223e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by minimum rating',
    example: '3',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  minRating?: number;

  @ApiPropertyOptional({
    description: 'Sort by (rating, date)',
    example: 'rating',
    enum: ['rating', 'date'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results (default: 10, max: 100)',
    example: '20',
    default: '10',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    description: 'Pagination offset (default: 0)',
    example: '0',
    default: '0',
  })
  @IsOptional()
  @IsNumberString()
  offset?: string;
}
