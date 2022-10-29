import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProviderModule as DatabaseModules } from './provider/database/mongodb/provider/provider.module';
// import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import DB_CONFIG from './config/database/configuration';
@Module({
  imports: [
    ConfigModule.forRoot( {
      isGlobal: true,
      load: [DB_CONFIG]
    }),
    DatabaseModules,
    UserModule,
    AuthModule,
    FileModule,
    CategoryModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
