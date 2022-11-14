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
import { Sub_Category } from '../../entity/sub_category.entity';
import { Profile } from '../../entity/user.entity';
import { Comment } from '../../entity/comment.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.PG_HOST || '127.0.0.1',
            port: Number(process.env.PG_PORT) || 5432,
            username: process.env.PG_USER || 'postgres',
            password: process.env.PASS || 'Nghi@#2001',
            database: process.env.DB || '5star',
            entities: [
                InternalAccount,
                Profile, Banner,
                Category,
                Brand, Product,
                Stock, Classify_1, Classify_2,
                Blog, Comment
            ],
            synchronize: true
        })
    ]
})
export class PostgresModule { }
