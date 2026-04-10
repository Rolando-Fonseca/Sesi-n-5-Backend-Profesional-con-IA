import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookingResponseDto {
  @ApiProperty({
    description: 'Booking ID',
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
    description: 'Reservation date and time',
    example: '2026-05-15T19:30:00.000Z',
  })
  reservationDateTime: Date;

  @ApiProperty({
    description: 'Number of guests',
    example: 4,
  })
  numberOfGuests: number;

  @ApiPropertyOptional({
    description: 'Special requests',
  })
  specialRequests?: string;

  @ApiPropertyOptional({
    description: 'Guest name',
  })
  guestName?: string;

  @ApiPropertyOptional({
    description: 'Guest phone',
  })
  guestPhone?: string;

  @ApiPropertyOptional({
    description: 'Guest email',
  })
  guestEmail?: string;

  @ApiProperty({
    description: 'Reservation status',
    example: 'confirmed',
  })
  status: string;

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
