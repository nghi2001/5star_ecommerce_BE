import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from 'src/entity/banner.entity';
import { Brand } from 'src/entity/brand.entity';
import { Category } from 'src/entity/Category.entity';
import { InternalAccount } from 'src/entity/internal_account.entity';
import { Product } from 'src/entity/product.entity';
import { Sub_Category } from 'src/entity/sub_category.entity';
import { Profile } from 'src/entity/user.entity';
console.log(process.env.PASS);

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.PG_HOST||'127.0.0.1',
            port: Number(process.env.PG_PORT) || 5432,
            username: process.env.PG_USER || 'postgres',
            password: process.env.PASS || 'Nghi@#2001',
            database: process.env.DB || '5star',
            entities: [
                InternalAccount,
                Profile, Banner,
                Category, Sub_Category,
                Brand, Product
            ],
            synchronize: true
        })
    ]
})
export class PostgresModule {}
