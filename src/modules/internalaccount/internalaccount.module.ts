import { Module } from '@nestjs/common';
import { InternalaccountController } from './internalaccount.controller';
import { InternalaccountService } from './internalaccount.service';

@Module({
  controllers: [InternalaccountController],
  providers: [InternalaccountService]
})
export class InternalaccountModule {}
