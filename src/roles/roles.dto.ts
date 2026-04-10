/**
 * RoleResponseDto
 * 
 * Simple DTO for role information.
 * Roles are mainly enum-based in this application.
 * 
 * Available roles:
 * - CUSTOMER: Regular customer who makes reservations and writes reviews
 * - STAFF: Restaurant staff who manage bookings and menus
 * - ADMIN: System administrator with full access
 * 
 * See: db_model.md - UserRole enum
 */
export class RoleResponseDto {
  name: string;
  description: string;
  permissions: string[];
}

/**
 * Get built-in roles configuration
 */
export const ROLES_CONFIG = {
  CUSTOMER: {
    name: 'CUSTOMER',
    description: 'Regular customer',
    permissions: [
      'view_restaurants',
      'create_booking',
      'view_booking',
      'cancel_booking',
      'create_review',
      'update_own_review',
      'view_reviews',
    ],
  },
  STAFF: {
    name: 'STAFF',
    description: 'Restaurant staff member',
    permissions: [
      'view_restaurant',
      'manage_bookings',
      'manage_tables',
      'view_orders',
      'update_order_status',
      'manage_menu',
      'view_menu_items',
    ],
  },
  ADMIN: {
    name: 'ADMIN',
    description: 'System administrator',
    permissions: [
      'manage_all_restaurants',
      'manage_all_users',
      'manage_all_bookings',
      'manage_all_orders',
      'manage_all_reviews',
      'view_system_analytics',
      'manage_system_settings',
    ],
  },
};
