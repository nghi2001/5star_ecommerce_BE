import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { createCategoryDTO } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        private CategoryRepository: CategoryRepository
    ) { }
    async checkId(id) {
        if (Number(id) && id > 0) {
            return true;
        }
        throw new HttpException("not found", 404)
    }
    async checkExist(id: number) {
        let [err] = await this.checkId(id).then(result => [null, result]).catch(err => [err, null]);
        if (err) throw new HttpException("id invalid", 400);
        let category = await this.getOne(id);
        if (category) {
            return true;
        }
        throw new HttpException("category not found", 404);
    }

    async createCategory(category: createCategoryDTO) {
        if (category.parent_id) {
            await this.checkExist(category.parent_id);
        }
        let checkNameCategory = await this.CategoryRepository.findOneBy({ name: category.name });
        if (checkNameCategory) {
            throw new HttpException("category name already exist", HttpStatus.CONFLICT);
        }
        let newCategory = await this.CategoryRepository.createCategory(category);
        return newCategory;
    }

    async getAll() {
        let [categorys, count] = await this.CategoryRepository.getAllCategory();
        return [categorys, count];
    }

    async getOne(id) {
        if (this.checkId(id)) {
            let category = await this.CategoryRepository.getOneCategory(id);
            return category;
        }
    }

    async deleteOne(id) {
        if (this.checkId(id)) {
            let result = await this.CategoryRepository.delete(id);
            return result;
        }
    }

    async updateCategory(id: number, category: createCategoryDTO) {
        if (this.checkId(id)) {
            let result = await this.CategoryRepository.update({ id }, category)
            return result
        }
    }
}
