import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * AuthGuard
 * 
 * Valida que la request incluya un JWT token válido en el header Authorization.
 * Extrae el payload del token y lo asigna a request.user.
 * 
 * Uso:
 * @UseGuards(AuthGuard)
 * @Get()
 * getPublicData() {}
 * 
 * Implementación completa:
 * 1. Extraer token del header Authorization: "Bearer <token>"
 * 2. Validar formato y presencia del token
 * 3. Decodificar sin validación (la validación de firma es responsabilidad del servicio de auth)
 * 4. Asignar payload a request.user
 * 
 * Ver: architecture_nest.md - Sección Guard Implementations
 * Ver: E2E_TESTING_GUIDE.md - Sección Auth Testing
 * 
 * TODO: Implementar validación de firma JWT con secret
 * TODO: Implementar manejo de tokens expirados
 * TODO: Integrar con AuthService para validación de usuario
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization scheme');
    }

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      // TODO: Implementar validación real de JWT con secret
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // request.user = decoded;
      
      // Por ahora, solo parseamos el payload (sin validar firma)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new UnauthorizedException('Invalid token format');
      }

      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      request.user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
