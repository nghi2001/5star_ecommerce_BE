import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BigBannerController } from './big-banner.controller';
import { BannerRepository } from './big-banner.repository';
import { BigBannerService } from './big-banner.service';
import { Banner, BannerSchema } from './entities/banner.entities';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Banner.name, schema: BannerSchema}])
  ],
  controllers: [BigBannerController],
  providers: [BigBannerService, BannerRepository]
})
export class BigBannerModule {}
