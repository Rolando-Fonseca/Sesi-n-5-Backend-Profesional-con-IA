import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * RolesGuard
 * 
 * Valida que el usuario tiene uno de los roles requeridos para acceder al endpoint.
 * Se usa conjuntamente con el decorador @Roles().
 * 
 * Uso:
 * @UseGuards(AuthGuard, RolesGuard)
 * @Roles(UserRole.ADMIN)
 * @Delete(':id')
 * delete(@Param('id') id: string) {}
 * 
 * Flujo:
 * 1. Extraer roles requeridos del metadato 'roles' establecido por @Roles()
 * 2. Obtener usuario desde request (debe estar autenticado con AuthGuard)
 * 3. Validar que el role del usuario está en la lista de roles permitidos
 * 4. Permitir o denegar acceso
 * 
 * Ver: architecture_nest.md - Sección Guard Implementations
 * Ver: db_model.md - Sección UserRole enum
 * 
 * TODO: Implementar validación de permisos más granular (por operación)
 * TODO: Agregar caching de roles para performance
 * TODO: Implementar auditoría de acceso denegado
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `This action requires one of the following roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
