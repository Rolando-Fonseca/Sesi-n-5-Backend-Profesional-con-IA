import { IsOptional, IsString, IsNumberString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListUsersDto {
  @ApiPropertyOptional({
    description: 'Search by email or name',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by role',
    example: 'CUSTOMER',
    enum: ['CUSTOMER', 'STAFF', 'ADMIN'],
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results (default: 10)',
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
