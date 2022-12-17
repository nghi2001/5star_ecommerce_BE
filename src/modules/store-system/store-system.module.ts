import { Module } from '@nestjs/common';
import { StoreSystemService } from './store-system.service';
import { StoreSystemController } from './store-system.controller';
import { StoreSystemRepository } from './store-system.repository';

@Module({
  providers: [StoreSystemService, StoreSystemRepository],
  controllers: [StoreSystemController]
})
export class StoreSystemModule { }
