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
import { CardModule } from './modules/cart/cart.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from 'path';
import { CouponModule } from './modules/coupon/coupon.module';
import { BullModule } from '@nestjs/bull';
import { WorkerModule } from './queue/worker/worker.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { OrderModule } from './modules/order/order.module';
import { APP_GUARD } from '@nestjs/core';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { StoreSystemModule } from './modules/store-system/store-system.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { EventsModule } from './events/events.module';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ttl: config.get('THROTTLE_TTL'),
          limit: config.get('THROTTLE_LIMIT'),
        }
      }
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => ({
        redis: {
          host: configService.get("REDIS_HOST"),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
          username: configService.get('REDIS_USERNAME')
        }
      })
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    ConfigModule.forRoot({
      isGlobal: true
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
    CardModule,
    CouponModule,
    WorkerModule,
    OrderModule,
    WishlistModule,
    StoreSystemModule,
    PaymentMethodModule,
    EventsModule
  ],
  controllers: [AppController, AwsS3Controller],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule { }
