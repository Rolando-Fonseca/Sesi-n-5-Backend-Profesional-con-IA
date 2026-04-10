import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { RestaurantsController } from "./restaurants.controller";
import { RestaurantsService } from "./restaurants.service";
import { RestaurantsRepository } from "./restaurants.repository";

/**
 * RestaurantsModule
 *
 * Módulo completo para gestión de restaurantes.
 *
 * Estructura:
 * - Controller: Maneja HTTP requests/responses
 * - Service: Lógica de negocio
 * - Repository: Acceso a datos con Prisma
 *
 * Dependencias:
 * - DatabaseModule: Proporciona PrismaService
 *
 * Exporta:
 * RestaurantsModule no exporta nada (es módulo hoja)
 *
 * Ver: architecture_nest.md - Sección Module Organization
 */
@Module({
  imports: [DatabaseModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantsRepository],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
