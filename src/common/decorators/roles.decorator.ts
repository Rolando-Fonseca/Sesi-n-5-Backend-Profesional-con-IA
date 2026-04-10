import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

/**
 * @Roles(UserRole.ADMIN, UserRole.STAFF)
 * 
 * Marca un endpoint como requiriendo ciertos roles.
 * Se usa en conjunto con RolesGuard para validar autorización.
 * 
 * Ejemplo:
 * @Post()
 * @UseGuards(AuthGuard, RolesGuard)
 * @Roles(UserRole.ADMIN)
 * createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
 *   return this.restaurantsService.create(createRestaurantDto);
 * }
 * 
 * Ver: architecture_nest.md - Sección Guard Implementations
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
