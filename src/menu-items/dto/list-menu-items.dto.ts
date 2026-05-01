import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListMenuItemsDto {
  @ApiPropertyOptional({
    description: 'Filter by location/menu ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiPropertyOptional({
    description: 'Search by dish name or description',
    example: 'Carbonara',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by category',
    example: 'Main Course',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter by availability status',
    example: 'available',
    enum: ['available', 'unavailable', 'seasonal'],
  })
  @IsOptional()
  @IsString()
  availability?: string;

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
