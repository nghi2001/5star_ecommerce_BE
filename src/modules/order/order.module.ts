import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module'
import { CouponModule } from '../coupon/coupon.module';
import { ProductModule } from '../product/product.module';
import { OrderDetailRepository } from './order_detail.repository';
@Module({
  imports: [
    UserModule,
    CouponModule,
    ProductModule
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderDetailRepository]
})
export class OrderModule { }
