import { Injectable, HttpException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { createCategoryDTO } from './dto/create-category.dto';
import { Types } from 'mongoose';
@Injectable()
export class CategoryService {
    constructor(
        private CategoryRepository: CategoryRepository
    ) { }
    checkId(id) {
        if (Types.ObjectId.isValid(id)) {
            return true;
        }
        throw new HttpException("not found", 404)
    }
    async createCategory(category: createCategoryDTO) {
        let newCategory = await this.CategoryRepository.create(category);
        return newCategory;
    }

    async getAll() {
        let categorys = await this.CategoryRepository.find({});
        return categorys;
    }
    async getOne(id) {
        if (this.checkId(id)) {
            let category = await this.CategoryRepository.findById(id);
            return category;
        }
    }
    async getOneSub(idParent: string, id: string) {
        if (this.checkId(idParent) && this.checkId(id)) {
            let category = await this.CategoryRepository.findSub(idParent, id);
            return category
        }
    }

    async deleteOne(id) {
        if (this.checkId(id)) {
            let result = await this.CategoryRepository.delete(id);
            return result;
        }
    }

    async addSubCategory(idParent: string, category: createCategoryDTO) {
        if (this.checkId(idParent)) {
            let newCategory = await this.CategoryRepository.insertSub(idParent, category);
            return newCategory;
        }
    }

    async deleteSubCategory(idParent: string, id: string) {
        if (this.checkId(idParent) && this.checkId(id)) {
            let sub_category = await this.getOneSub(idParent, id);
            if (sub_category) {
                let result = await this.CategoryRepository.deleteSub(idParent, id);
                return true
            }
            return false
        }
    }

    async updateSubCategoty(idParent: string, id: string, category: createCategoryDTO) {
        if(this.checkId(idParent) && this.checkId(id)) {
            let result = await this.CategoryRepository.updateSub(idParent, id, category);
            return result
        }
    }
    async updateCategory(id: string, category: createCategoryDTO) {
        if( this.checkId(id) ) {
            let result = await this.CategoryRepository.update((new Types.ObjectId(id)), category)
            return result
        }
    }
}
