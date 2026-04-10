import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

/**
 * RolesModule
 * 
 * TODO: Complete roles module implementation
 * 
 * Currently implemented:
 * - RolesService with built-in role configuration
 * - RolesController with GET endpoints
 * - Role and permission DTOs
 * 
 * TODO: Implement in database:
 * - Create roles table if custom roles needed
 * - Create role_permissions junction table
 * - Store role definitions persistently
 * 
 * TODO: Add endpoints/features:
 * - POST /roles - Create custom role (admin)
 * - PUT /roles/:name - Update role (admin)
 * - DELETE /roles/:name - Delete role (admin)
 * - PUT /roles/:name/permissions - Manage permissions (admin)
 * 
 * TODO: Add guards:
 * - @UseGuards(AuthGuard, RolesGuard)
 * - @Roles(UserRole.ADMIN) for write operations
 * 
 * Current role hierarchy:
 * CUSTOMER < STAFF < ADMIN
 * 
 * The application currently uses enum-based roles defined in Prisma schema.
 * This module provides role information and permission checking.
 * 
 * See: db_model.md - UserRole enum
 * See: architecture_nest.md - Authorization/Roles section
 * See: api_contracts.md - Roles endpoints
 */
@Module({
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
