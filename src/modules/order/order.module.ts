import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module'
@Module({
  imports: [
    UserModule
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository]
})
export class OrderModule { }
