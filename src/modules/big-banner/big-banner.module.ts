import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BigBannerController } from './big-banner.controller';
import { BannerRepository } from './big-banner.repository';
import { BigBannerService } from './big-banner.service';
import { Banner } from '../../entity/banner.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banner])
  ],
  controllers: [BigBannerController],
  providers: [BigBannerService, BannerRepository]
})
export class BigBannerModule { }
