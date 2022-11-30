import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { Classify_1_Repository } from './classify_1.repository';
import { Classify_2_Repository } from './classify_2.repository';
import { StockRepository } from './stock.repository';
import { CategoryModule } from '../category/category.module';
import { BrandModule } from '../brand/brand.module';
import { FileModule } from '../file/file.module';

@Module({
  providers: [
    ProductService,
    ProductRepository,
    Classify_1_Repository,
    Classify_2_Repository,
    StockRepository
  ],
  controllers: [ProductController],
  imports: [
    CategoryModule,
    BrandModule,
    FileModule
  ],
  exports: [
    ProductService
  ]
})
export class ProductModule { }
