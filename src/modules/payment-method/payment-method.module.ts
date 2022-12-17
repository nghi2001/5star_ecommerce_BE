import { Module } from '@nestjs/common';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodRepository } from './payment-method.repository';
import { PaymentMethodService } from './payment-method.service';

@Module({
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService, PaymentMethodRepository],
  exports: [PaymentMethodService]
})
export class PaymentMethodModule { }
