import { IsString, IsOptional, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Restaurant ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  restaurantId: string;

  @ApiProperty({
    description: 'User ID',
    example: '223e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Reservation date and time (ISO 8601)',
    example: '2026-05-15T19:30:00Z',
  })
  @IsDateString()
  reservationDateTime: string;

  @ApiProperty({
    description: 'Number of guests',
    example: 4,
    minimum: 1,
    maximum: 20,
  })
  @IsNumber()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  numberOfGuests: number;

  @ApiPropertyOptional({
    description: 'Special requests or notes',
    example: 'Vegetarian options preferred',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({
    description: 'Guest name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  guestName?: string;

  @ApiPropertyOptional({
    description: 'Guest phone number',
    example: '+1-555-123-4567',
  })
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiPropertyOptional({
    description: 'Guest email',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsString()
  guestEmail?: string;
}
