import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { updateCategoryDTO } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { createCategoryDTO } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        private CategoryRepository: CategoryRepository
    ) { }

    constraintColumn() {
        return {
            priority: true,
            id: true,
            name: true,
            slug: true,
            parent_id: true,
            status: true
        }
    }
    async renderCondition(query) {
        let condition: any = {};
        let {
            priority,
            id,
            name,
            slug,
            parent_id,
            status
        } = query;
        if (priority) {
            condition.priority = priority;
        }
        if (id) {
            condition.id = id;
        }
        if (name) {
            condition.name = name;
        }
        if (slug) {
            condition.slug = slug;
        }
        if (parent_id) {
            condition.parent_id = parent_id;
        }
        if (status) {
            condition.status = status;
        }
        return condition;
    }
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

    async getAll(filter = {}, pagination = {}, sort = {}) {
        let data = await this.CategoryRepository.getList(filter, pagination, sort);
        return data;
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

    async updateCategory(id: number, category: updateCategoryDTO) {
        if (this.checkId(id)) {
            let dataUpdate: updateCategoryDTO = {};
            let data = await this.getOne(id);
            if (category.name && category.name != data.name) {
                dataUpdate.name = category.name;
            }
            if (category.priority && category.priority != data.priority) {
                dataUpdate.priority = category.priority;
            }
            if (category.slug && category.slug != data.slug) {
                dataUpdate.slug = category.slug;
            }
            if (category.status && category.status != data.status) {
                dataUpdate.status = category.status;
            }
            let result = await this.CategoryRepository.update({ id }, category)
            return result
        }
    }
}
