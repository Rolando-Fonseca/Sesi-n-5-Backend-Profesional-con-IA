import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

/**
 * UsersController
 * 
 * TODO: Implement all HTTP endpoints
 * 
 * Endpoints to implement:
 * - POST /users/register - Register new user
 * - POST /users/login - User login
 * - POST /users/refresh-token - Refresh JWT token
 * - GET /users/profile - Get current user profile
 * - PUT /users/profile - Update user profile
 * - PUT /users/password - Change password
 * - GET /users/:id - Get user by ID (admin only)
 * - DELETE /users/:id - Delete user account
 * 
 * Guards to apply:
 * TODO: @UseGuards(AuthGuard) for protected endpoints
 * TODO: @UseGuards(RolesGuard) with @Roles(UserRole.ADMIN) for admin-only endpoints
 * 
 * See: api_contracts.md - User endpoints
 * See: architecture_nest.md - User module flow
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: Implement controller methods
  // POST /users (create)
  // GET /users (list - admin only)
  // GET /users/:id (get by id)
  // PUT /users/:id (update)
  // DELETE /users/:id (delete)
}
