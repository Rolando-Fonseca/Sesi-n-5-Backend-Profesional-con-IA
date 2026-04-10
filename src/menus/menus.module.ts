import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { MenusRepository } from './menus.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [MenusController],
  providers: [MenusService, MenusRepository],
  exports: [MenusService],
})
export class MenusModule {}
