import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @CurrentUser()
 * 
 * Extrae el usuario actual desde el JWT token en la request.
 * Se usa conjuntamente con AuthGuard.
 * 
 * Ejemplo:
 * @Get()
 * @UseGuards(AuthGuard)
 * getProfile(@CurrentUser() user: JwtPayload) {
 *   return user;
 * }
 * 
 * Ver: architecture_nest.md - Sección Guard Implementations
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
