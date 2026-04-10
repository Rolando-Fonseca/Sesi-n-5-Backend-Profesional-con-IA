import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { RoleResponseDto } from './roles.dto';

/**
 * RolesController
 * 
 * TODO: Implement role management endpoints
 * 
 * Endpoints to implement:
 * - GET /roles - List all roles
 * - GET /roles/:name - Get specific role
 * - POST /roles - Create custom role (admin only)
 * - PUT /roles/:name - Update role (admin only)
 * - DELETE /roles/:name - Delete role (admin only)
 * - PUT /roles/:name/permissions - Assign permissions to role (admin only)
 * 
 * Guards:
 * TODO: Add @UseGuards(AuthGuard, RolesGuard)
 * TODO: Add @Roles(UserRole.ADMIN) for create/update/delete operations
 * 
 * See: api_contracts.md - Roles endpoints
 */
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * GET /roles
   * List all available roles with their permissions
   * 
   * No authentication required for this endpoint.
   * Can be public or require basic auth depending on security policy.
   */
  @Get()
  @ApiOperation({
    summary: 'List all roles',
    description: 'Get all available roles with their permissions',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
    type: RoleResponseDto,
    isArray: true,
  })
  getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  /**
   * GET /roles/:name
   * Get a specific role by name
   *
   * Params:
   * - name: Role name (CUSTOMER, STAFF, ADMIN)
   */
  @Get(':name')
  @ApiOperation({
    summary: 'Get role by name',
    description: 'Retrieve a specific role and its permissions',
  })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  getRoleByName(@Param('name') name: string) {
    return this.rolesService.getRoleByName(name);
  }

  // TODO: Implement POST, PUT, DELETE endpoints for role management
  // These endpoints should be admin-only and manage custom roles
}
