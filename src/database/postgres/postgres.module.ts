import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from '../../entity/banner.entity';
import { Blog } from '../../entity/blog.entity';
import { Brand } from '../../entity/brand.entity';
import { Category } from '../../entity/category.entity';
import { Classify_1 } from '../../entity/classify_1.entity';
import { Classify_2 } from '../../entity/classify_2.entity';
import { InternalAccount } from '../../entity/internal_account.entity';
import { Product } from '../../entity/product.entity';
import { Stock } from '../../entity/stock.entity';
import { Profile } from '../../entity/user.entity';
import { Comment } from '../../entity/comment.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MediaFile } from '../../entity/media.entity';

console.log(process.env.DB);
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get("DB_HOST") || '127.0.0.1',
                port: Number(configService.get("DB_PORT")) || null,
                username: configService.get("DB_USER") || 'postgres',
                password: configService.get("DB_PASS") || 'Nghi@#2001',
                database: configService.get('DB_NAME') || '5star',
                entities: [
                    InternalAccount,
                    Profile,
                    Banner,
                    Category,
                    Brand,
                    Product,
                    Stock,
                    Classify_1,
                    Classify_2,
                    Blog,
                    Comment,
                    MediaFile
                ],
                synchronize: true
            }),
            inject: [ConfigService]
        })
    ]
})

export class PostgresModule {
    constructor() {
    }
}
