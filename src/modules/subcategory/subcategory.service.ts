import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { createCategoryDTO } from './dto/create-category.dto';
import { updateCategoryDTO } from './dto/update-category.dto';
import { SubCategoryRepository } from './subcategory.repository';

@Injectable()
export class SubcategoryService {
    constructor(
        private SubCategoryRepository: SubCategoryRepository,
        private CategoryService: CategoryService
    ){}
    async checkCategory(id:number) {
        let category = await this.CategoryService.getOne(id);
        if( category ) {
            return true;
        }
        throw new HttpException("Category Parent Not Exist", HttpStatus.NOT_FOUND);
    }
    async getAll () {
        let result = await this.SubCategoryRepository.findAndCount({});
        return result;
    }

    async getOne (id: number) {
        let result = await this.SubCategoryRepository.findOneBy({id});
        return result;
    }
    async create(category: createCategoryDTO) {
        let check = await this.checkCategory(category.id_category);
        if( check ) {
            let result = this.SubCategoryRepository.createSubCategory(category);
            return result;
        }
    }

    async delete(id: number) {
        let result =  await this.SubCategoryRepository.delete({id});
        return result;
    }
    async update(id, category: updateCategoryDTO) {
        let result = await this.SubCategoryRepository.update({id}, category);
        return result;
    }
}
