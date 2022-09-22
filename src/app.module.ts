import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProviderModule as DatabaseModules } from './provider/database/mongodb/provider/provider.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import DB_CONFIG from './config/database/configuration';
@Module({
  imports: [
    ConfigModule.forRoot( {
      isGlobal: true,
      load: [DB_CONFIG]
    }),
    DatabaseModules,
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
