# Partial Modules - Implementation Checklist

This document provides detailed implementation tasks for the two partial modules that are scaffolded as educational examples for students.

---

## 📚 Module: Users

**Status**: Scaffolded with structure and TODO comments  
**Files**: 8 files (Controller, Service, Repository, DTOs, Module)  
**Difficulty**: Medium-High (involves security and authentication)

### Architecture

```
src/users/
├── dto/
│   ├── create-user.dto.ts       # Has basic structure
│   ├── update-user.dto.ts       # PartialType implemented
│   ├── list-users.dto.ts        # Filter/pagination DTO
│   └── user-response.dto.ts     # Response format
├── entities/                    # (Optional - for TypeORM)
├── users.controller.ts          # Routes defined as comments
├── users.service.ts             # Service shell with TODOs
├── users.repository.ts          # Repository shell with TODOs
└── users.module.ts              # Module properly configured
```

### Step 1: Repository Implementation

**File**: `src/users/users.repository.ts`

Implement the following methods:

```typescript
async create(createUserDto: CreateUserDto)
// - Hash password with bcrypt (10+ rounds)
// - Store user in database
// - Return user without password field

async findAll(listUsersDto: ListUsersDto)
// - Support search by email/name
// - Filter by role (CUSTOMER, STAFF, ADMIN)
// - Implement pagination (limit, offset)
// - Return paginated results

async findById(id: string)
// - Get user by UUID
// - Include role information
// - Exclude password field

async findByEmail(email: string)
// - Find user by email (unique field)
// - Used for login validation
// - Should include password for verification

async update(id: string, updateUserDto: UpdateUserDto)
// - Update user fields (except password - separate endpoint)
// - Validate email uniqueness if changed
// - Return updated user

async delete(id: string)
// - Soft delete or hard delete
// - If soft delete: set deletedAt timestamp
// - Confirm deletion with user ID

async exists(id: string): Promise<boolean>
// - Check if user exists and is not deleted
```

**Reference**: See `src/restaurants/restaurants.repository.ts` for similar implementation pattern

### Step 2: Service Implementation

**File**: `src/users/users.service.ts`

Implement the following methods:

```typescript
async register(createUserDto: CreateUserDto)
// - Validate email format
// - Check email uniqueness
// - Call repository.create()
// - Return success response
// - Send verification email (if needed)

async findAll(listUsersDto: ListUsersDto)
// - Call repository.findAll()
// - Format paginated response
// - Return with pagination metadata

async findById(id: string)
// - Verify user exists
// - Return user profile
// - Throw NotFoundException if not found

async update(id: string, updateUserDto: UpdateUserDto)
// - Verify user exists
// - Validate data
// - Call repository.update()
// - Return updated user

async delete(id: string)
// - Verify user exists
// - Check authorization (only self or admin)
// - Call repository.delete()
// - Return success message

async changePassword(userId: string, oldPassword: string, newPassword: string)
// - TODO: Implement password change
// - Verify old password matches
// - Hash new password
// - Update in database

async validateCredentials(email: string, password: string)
// - TODO: Implement for login
// - Find user by email
// - Compare passwords with bcrypt
// - Return user if valid

async resetPassword(email: string)
// - TODO: Generate password reset token
// - Store token in database with expiration
// - Send reset email to user
```

**Reference**: See `src/restaurants/restaurants.service.ts` for business logic pattern

### Step 3: Controller Implementation

**File**: `src/users/users.controller.ts`

Uncomment and implement these endpoints:

```typescript
@Post('/register')
async register(@Body() createUserDto: CreateUserDto)
// POST /users/register
// - Create new user account
// - Validate DTO
// - Return created user with 201 status

@Post('/login')
async login(@Body() loginDto: LoginDto)
// POST /users/login
// - Validate email/password
// - Generate JWT token
// - Return token and user info

@Post('/refresh-token')
@UseGuards(AuthGuard)
async refreshToken(@CurrentUser() user: JwtPayload)
// POST /users/refresh-token
// - Require valid JWT
// - Generate new token
// - Extend session

@Get('/profile')
@UseGuards(AuthGuard)
async getProfile(@CurrentUser() user: JwtPayload)
// GET /users/profile
// - Require authentication
// - Return current user profile

@Put('/profile')
@UseGuards(AuthGuard)
async updateProfile(@CurrentUser() user: JwtPayload, @Body() updateUserDto: UpdateUserDto)
// PUT /users/profile
// - Require authentication
// - Update current user
// - Return updated profile

@Put('/password')
@UseGuards(AuthGuard)
async changePassword(@CurrentUser() user: JwtPayload, @Body() changePasswordDto: ChangePasswordDto)
// PUT /users/password
// - Require authentication
// - Validate old password
// - Update to new password

@Get()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async findAll(@Query() listUsersDto: ListUsersDto)
// GET /users
// - Require admin role
// - List all users with filters
// - Return paginated results

@Get(':id')
@UseGuards(AuthGuard, RolesGuard)
async findById(@Param('id') id: string, @CurrentUser() user: JwtPayload)
// GET /users/:id
// - Allow self-access and admins
// - Return user by ID

@Put(':id')
@UseGuards(AuthGuard, RolesGuard)
async update(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Body() updateUserDto: UpdateUserDto)
// PUT /users/:id
// - Require authentication
// - Allow self-update and admin update
// - Return updated user

@Delete(':id')
@UseGuards(AuthGuard, RolesGuard)
async delete(@Param('id') id: string, @CurrentUser() user: JwtPayload)
// DELETE /users/:id
// - Require authentication
// - Allow self-delete and admin delete
// - Return confirmation
```

### Step 4: DTOs (Complete)

DTOs are mostly done, but may need:
- Add LoginDto for authentication
- Add ChangePasswordDto for password changes
- Add validation decorators to all fields

### Step 5: Guards & Security

Implement in `src/common/guards/`:

1. **AuthGuard**: Already scaffolded, complete JWT validation:
   ```typescript
   // - Extract JWT from Authorization header
   // - Validate signature with JWT_SECRET
   // - Handle expired tokens
   // - Attach user to request
   ```

2. **RolesGuard**: Already scaffolded, ensure it checks user.role against @Roles()

### Step 6: Additional Components

Create these new files:

**src/auth/auth.service.ts**
```typescript
// Implement JWT token generation:
// - generateToken(user)
// - validateToken(token)
// - refreshToken(token)
```

**src/auth/auth.module.ts**
```typescript
// Import and provide JwtService
// Export AuthService for use in other modules
```

**src/auth/dto/login.dto.ts**
```typescript
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### Step 7: Testing

Create `test/users.e2e-spec.ts`:

```typescript
describe('Users (e2e)', () => {
  // Test registration flow
  // Test login with valid/invalid credentials
  // Test profile retrieval
  // Test profile updates
  // Test password change
  // Test admin-only endpoints
  // Test authorization errors
});
```

### Reference Documents
- **API Contracts**: See `Docs/E4/api_contracts.md` - User/Auth section
- **Database Schema**: See `Docs/E4/db_model.md` - User entity
- **Architecture**: See `Docs/E4/architecture_nest.md` - User module flow
- **Similar Implementation**: `src/restaurants/` for pattern reference

---

## 📚 Module: Roles

**Status**: Partially implemented with read endpoints  
**Files**: 4 files (Controller, Service, DTOs, Module)  
**Difficulty**: Easy-Medium (mostly configuration-based)

### Architecture

```
src/roles/
├── roles.dto.ts              # Done: RoleResponseDto + ROLES_CONFIG
├── roles.service.ts          # Partially done: Read methods + TODOs
├── roles.controller.ts       # Partially done: GET endpoints + TODOs
└── roles.module.ts           # Done: Module properly configured
```

### What's Already Implemented ✅

- **ROLES_CONFIG**: Built-in role definitions with permissions
- **RolesService.getAllRoles()**: List all roles
- **RolesService.getRoleByName()**: Get specific role
- **RolesService.hasPermission()**: Permission checking

### What's NOT Implemented (TODO) 📝

### Step 1: Service Enhancement

**File**: `src/roles/roles.service.ts`

Add these methods:

```typescript
async createCustomRole(createRoleDto: CreateRoleDto)
// - Validate role name (must be unique)
// - Validate permissions list
// - Store in database (create roles table if needed)
// - Return created role

async updateRole(name: string, updateRoleDto: UpdateRoleDto)
// - Find existing role
// - Update permissions or description
// - Return updated role
// - Throw NotFoundException if not found

async deleteRole(name: string)
// - Check if role is in use (no users have this role)
// - Delete from database
// - Return success message
// - Throw error if role is in use

async assignPermissionsToRole(name: string, permissions: string[])
// - Find role
// - Validate permissions exist
// - Update role permissions
// - Return updated role with permissions

async removePermissionsFromRole(name: string, permissions: string[])
// - Find role
// - Remove specific permissions
// - Return updated role

async getRolePermissions(name: string): Promise<string[]>
// - Get all permissions for a role
// - Include inherited permissions
// - Return permission list
```

### Step 2: Controller Enhancement

**File**: `src/roles/roles.controller.ts`

Uncomment and implement these endpoints:

```typescript
@Post()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async createRole(@Body() createRoleDto: CreateRoleDto)
// POST /roles
// - Admin only
// - Create custom role
// - Validate input

@Put(':name')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async updateRole(@Param('name') name: string, @Body() updateRoleDto: UpdateRoleDto)
// PUT /roles/:name
// - Admin only
// - Update role description/permissions

@Delete(':name')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async deleteRole(@Param('name') name: string)
// DELETE /roles/:name
// - Admin only
// - Delete custom role if not in use

@Put(':name/permissions')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async assignPermissions(@Param('name') name: string, @Body() permissionsDto: { permissions: string[] })
// PUT /roles/:name/permissions
// - Admin only
// - Update role permissions
```

### Step 3: DTOs

Create new DTOs in `src/roles/`:

**roles.dto.ts** - Add these:

```typescript
export class CreateRoleDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export const AVAILABLE_PERMISSIONS = [
  'view_restaurants',
  'create_booking',
  'manage_restaurants',
  'manage_users',
  'manage_system',
  // ... add all permissions
];
```

### Step 4: Database Setup (If using Prisma)

If implementing persistent roles, update `prisma/schema.prisma`:

```prisma
model Role {
  id          String @id @default(cuid())
  name        String @unique
  description String?
  permissions String[] // Array of permission names
  
  users       User[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@index([name])
}
```

Then run: `npx prisma migrate dev --name add_custom_roles`

### Step 5: Integration with Users

Ensure users can have custom roles:

In `prisma/schema.prisma` User model:
```prisma
model User {
  // ... existing fields
  roleId    String?
  role      Role?    @relation(fields: [roleId], references: [id])
  
  // Keep enum for built-in roles as fallback
  builtInRole UserRole
}
```

### Step 6: Permission Validation

Create `src/roles/permission.decorator.ts`:

```typescript
export const RequirePermission = (permission: string) => {
  return SetMetadata('permission', permission);
};
```

Create `src/common/guards/permission.guard.ts`:

```typescript
@Injectable()
export class PermissionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get('permission', context.getHandler());
    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user's role has required permission
    return rolesService.hasPermission(user.role, requiredPermission);
  }
}
```

### Step 7: Testing

Create `test/roles.e2e-spec.ts`:

```typescript
describe('Roles (e2e)', () => {
  // Test getting all roles
  // Test getting specific role
  // Test creating custom role (admin)
  // Test updating role (admin)
  // Test deleting role (admin)
  // Test permission assignment
  // Test authorization (non-admin cannot create)
});
```

### Step 8: Role Hierarchy

Consider implementing role hierarchy:

```typescript
// Permissions by role (reference from ROLES_CONFIG)
const ROLE_HIERARCHY = {
  'admin': 1000,      // Can do everything
  'staff': 500,       // Can manage restaurant operations
  'customer': 100,    // Can make bookings and reviews
};

// Check if user can perform action for another user
canDo(userRole: string, targetRole: string): boolean {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole];
}
```

### Reference Documents
- **Current Roles**: See `src/roles/roles.dto.ts` - ROLES_CONFIG
- **API Contracts**: See `Docs/E4/api_contracts.md` - Roles section
- **Database Schema**: See `Docs/E4/db_model.md` - UserRole enum
- **Architecture**: See `Docs/E4/architecture_nest.md` - Authorization section

---

## 📊 Implementation Priority

### Must Have (High Priority)
1. **Users Module - Registration & Login**
   - User registration
   - Password hashing
   - JWT token generation
   - Profile retrieval

2. **Users Module - Authentication**
   - AuthGuard JWT validation
   - RolesGuard implementation
   - @UseGuards() application

### Should Have (Medium Priority)
1. **Users Module - Account Management**
   - Password change
   - Profile update
   - Account deletion

2. **Roles Module - Read Operations** ✅
   - Already implemented
   - Can start using immediately

### Nice to Have (Low Priority)
1. **Roles Module - Write Operations**
   - Custom role creation
   - Permission assignment
   - Role deletion

2. **Advanced Features**
   - Email verification
   - Password reset flow
   - OAuth integration
   - Two-factor authentication

---

## 🧪 Testing Guidelines

For both modules, test scenarios:

```typescript
// Happy path tests
- Successful creation
- Successful retrieval
- Successful update
- Successful deletion

// Error path tests  
- Invalid input validation
- Duplicate entries
- Not found errors
- Authorization failures
- Authentication failures

// Edge cases
- Null/undefined values
- Empty strings
- Maximum length violations
- Special characters
- Concurrent operations
```

---

## 📝 Documentation

As you implement, update:

1. **API Documentation**: Update Swagger decorators
2. **README**: Add implemented features
3. **CHANGELOG**: Log completed tasks
4. **Test Coverage**: Aim for 80%+ coverage
5. **Code Comments**: Document complex logic

---

## ✅ Completion Checklist

### Users Module
- [ ] Repository methods implemented
- [ ] Service methods implemented
- [ ] Controller endpoints implemented
- [ ] DTOs with full validation
- [ ] Swagger documentation complete
- [ ] Guards implemented (Auth + Roles)
- [ ] All tests passing
- [ ] Error handling complete
- [ ] Pagination working
- [ ] Security measures in place

### Roles Module
- [ ] Service methods implemented
- [ ] Controller endpoints implemented
- [ ] DTOs complete
- [ ] Swagger documentation complete
- [ ] Guards applied
- [ ] All tests passing
- [ ] Permission validation working
- [ ] Role hierarchy defined
- [ ] Custom role storage (if using DB)
- [ ] Documentation updated

---

**Next Steps**: Follow the step-by-step guides above and reference the complete modules for implementation patterns.

