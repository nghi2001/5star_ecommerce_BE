import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BigBannerController } from './big-banner.controller';
import { BannerRepository } from './big-banner.repository';
import { BigBannerService } from './big-banner.service';
import { Banner } from '../../entity/banner.entity';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    FileModule
  ],
  controllers: [BigBannerController],
  providers: [BigBannerService, BannerRepository]
})
export class BigBannerModule { }
