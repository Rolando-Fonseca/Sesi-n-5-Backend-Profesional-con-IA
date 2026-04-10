import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService
 * 
 * Gestiona la conexión con la base de datos PostgreSQL a través de Prisma ORM.
 * Se conecta automáticamente al inicializar el módulo y desconecta al terminar.
 * 
 * Uso en servicios:
 * - constructor(private prisma: PrismaService) {}
 * - this.prisma.user.findUnique({ where: { id } })
 * 
 * Referencia: https://www.prisma.io/docs/concepts/components/prisma-client
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected via Prisma');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Database disconnected');
  }
}
