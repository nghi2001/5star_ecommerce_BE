import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module'
import { CouponModule } from '../coupon/coupon.module';
import { ProductModule } from '../product/product.module';
import { OrderDetailRepository } from './order_detail.repository';
import { PaymentMethodModule } from '../payment-method/payment-method.module';
@Module({
  imports: [
    UserModule,
    CouponModule,
    ProductModule,
    PaymentMethodModule
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderDetailRepository]
})
export class OrderModule { }
