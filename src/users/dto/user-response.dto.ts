import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'john@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'First name',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
  })
  phone?: string;

  @ApiProperty({
    description: 'User role',
    example: 'CUSTOMER',
  })
  role: string;

  @ApiProperty({
    description: 'Email verified status',
    example: false,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-04-10T10:30:00.000Z',
  })
  createdAt: Date;
}
