import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { InternalaccountController } from './internalaccount.controller';
import { InternalAccountRepository } from './internalaccount.repository';
import { InternalaccountService } from './internalaccount.service';
import { BullModule } from '@nestjs/bull';
@Module({
  controllers: [InternalaccountController],
  providers: [InternalaccountService, InternalAccountRepository],
  imports: [
    BullModule.registerQueue({
      name: "mail"
    }),
    UserModule,
    JwtModule.register({})
  ],
  exports: [InternalaccountService]
})
export class InternalaccountModule { }
