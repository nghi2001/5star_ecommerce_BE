import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { InternalaccountController } from './internalaccount.controller';
import { InternalAccountRepository } from './internalaccount.repository';
import { InternalaccountService } from './internalaccount.service';

@Module({
  controllers: [InternalaccountController],
  providers: [InternalaccountService, InternalAccountRepository],
  imports: [
    UserModule
  ],
  exports: [InternalaccountService]
})
export class InternalaccountModule {}
