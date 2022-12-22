import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { RatingController } from './rating.controller';
import { RatingRepository } from './rating.repository';
import { RatingService } from './rating.service';

@Module({
  imports: [
    ProductModule
  ],
  controllers: [RatingController],
  providers: [RatingService, RatingRepository],
  exports: [

  ]
})
export class RatingModule { }
