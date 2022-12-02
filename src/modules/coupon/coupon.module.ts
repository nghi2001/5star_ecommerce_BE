import { Module } from '@nestjs/common';
import { CouponRepository } from './coupon.repository';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';

@Module({
  controllers: [CouponController],
  providers: [CouponService, CouponRepository]
})
export class CouponModule { }
