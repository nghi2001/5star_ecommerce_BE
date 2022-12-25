import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { GgAccountController } from './gg-account.controller';
import { GgAccountRepository } from './gg-account.repository';
import { GgAccountService } from './gg-account.service';

@Module({
  imports: [
    UserModule,
    AuthModule
  ],
  controllers: [GgAccountController],
  providers: [GgAccountService, GgAccountRepository]
})
export class GgAccountModule { }
