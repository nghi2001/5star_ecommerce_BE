import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { RatingController } from './rating.controller';
import { RatingRepository } from './rating.repository';
import { RatingService } from './rating.service';

@Module({
  imports: [
    ProductModule,
    OrderModule
  ],
  controllers: [RatingController],
  providers: [RatingService, RatingRepository],
  exports: [

  ]
})
export class RatingModule { }
