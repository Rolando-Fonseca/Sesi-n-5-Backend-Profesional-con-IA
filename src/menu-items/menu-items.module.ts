import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';
import { MenuItemsRepository } from './menu-items.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [MenuItemsController],
  providers: [MenuItemsService, MenuItemsRepository],
  exports: [MenuItemsService],
})
export class MenuItemsModule {}
