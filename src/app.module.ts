import { Module, CacheModule, CacheStoreFactory, CacheStore } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { BigBannerModule } from './modules/big-banner/big-banner.module';
import { AwsS3Controller } from './modules/aws_s3/aws_s3.controller';
import { AwsS3Module } from './modules/aws_s3/aws_s3.module';
import { PostgresModule } from './database/postgres/postgres.module';
import { InternalaccountModule } from './modules/internalaccount/internalaccount.module';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { BrandModule } from './modules/brand/brand.module';
import { BlogModule } from './modules/blog/blog.module';
import { CommentModule } from './modules/comment/comment.module';
import { CardModule } from './modules/card/card.module';
import DB_CONFIG from './config/database/configuration';
import { RedisModule } from 'nestjs-redis';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DB_CONFIG]
    }),
    // DatabaseModules,
    AuthModule,
    FileModule,
    CategoryModule,
    ProductModule,
    UserModule,
    BigBannerModule,
    AwsS3Module,
    PostgresModule,
    InternalaccountModule,
    SubcategoryModule,
    BrandModule,
    BlogModule,
    CommentModule,
    CardModule
  ],
  controllers: [AppController, AwsS3Controller],
  providers: [AppService],
})
export class AppModule { }
