import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateUserDto
 * 
 * TODO: Implement user creation logic
 * TODO: Add password hashing with bcrypt
 * TODO: Add email verification
 * TODO: Implement role assignment
 * 
 * See: api_contracts.md - POST /users/register
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    description: 'First name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1-555-123-4567',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
