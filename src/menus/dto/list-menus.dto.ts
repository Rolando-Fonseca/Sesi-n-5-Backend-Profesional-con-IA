import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListMenusDto {
  @ApiPropertyOptional({
    description: 'Filter by restaurant ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  restaurantId?: string;

  @ApiPropertyOptional({
    description: 'Search by name or description',
    example: 'Downtown',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results (default: 10, max: 100)',
    example: '10',
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
