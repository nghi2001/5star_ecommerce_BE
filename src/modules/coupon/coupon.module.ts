import { Module } from '@nestjs/common';
import { CouponRepository } from './coupon.repository';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { NotifyModule } from '../notify/notify.module';

@Module({
  imports: [
    NotifyModule
  ],
  controllers: [CouponController],
  providers: [CouponService, CouponRepository],
  exports: [CouponService]
})
export class CouponModule { }
