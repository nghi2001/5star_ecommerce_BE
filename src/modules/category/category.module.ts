import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../entity/category.entity';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Category])
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService]
})
export class CategoryModule { }
