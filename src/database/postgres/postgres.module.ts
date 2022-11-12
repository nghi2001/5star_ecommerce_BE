import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from 'src/entity/banner.entity';
import { Blog } from 'src/entity/blog.entity';
import { Brand } from 'src/entity/brand.entity';
import { Category } from 'src/entity/Category.entity';
import { Classify_1 } from 'src/entity/classify_1.entity';
import { Classify_2 } from 'src/entity/classify_2.entity';
import { InternalAccount } from 'src/entity/internal_account.entity';
import { Product } from 'src/entity/product.entity';
import { Sock } from 'src/entity/sock.entity';
import { Sub_Category } from 'src/entity/sub_category.entity';
import { Profile } from 'src/entity/user.entity';
import { Comment } from 'src/entity/comment.entity';

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
                Category, Sub_Category,
                Brand, Product,
                Sock, Classify_1, Classify_2,
                Blog, Comment
            ],
            synchronize: true
        })
    ]
})
export class PostgresModule { }
