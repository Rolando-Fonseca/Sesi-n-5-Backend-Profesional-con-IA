import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * DatabaseModule
 * 
 * Proporciona el servicio PrismaService a nivel global de la aplicación.
 * Exporta PrismaService para que otros módulos puedan inyectarlo.
 * 
 * Estructura:
 * - providers: [PrismaService] - Registra el servicio
 * - exports: [PrismaService] - Lo hace disponible en otros módulos
 * 
 * Ver: architecture_nest.md - Sección Database Layer
 */
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
