import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { SubcategoryController } from './subcategory.controller';
import { SubCategoryRepository } from './subcategory.repository';
import { SubcategoryService } from './subcategory.service';

@Module({
  controllers: [SubcategoryController],
  providers: [SubcategoryService, SubCategoryRepository],
  imports: [CategoryModule]
})
export class SubcategoryModule {}
