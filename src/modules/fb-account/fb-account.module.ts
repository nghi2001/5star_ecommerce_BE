import { Module } from '@nestjs/common';
import { FbAccountService } from './fb-account.service';
import { FbAccountController } from './fb-account.controller';
import { FbAccountRepository } from './fb-account.repository';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UserModule,
    AuthModule
  ],
  providers: [FbAccountService, FbAccountRepository],
  controllers: [FbAccountController]
})
export class FbAccountModule { }
