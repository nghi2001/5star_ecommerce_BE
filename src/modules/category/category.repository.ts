import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { createCategoryDTO } from './dto/create-category.dto';
import { Category } from 'src/entity/Category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
    constructor(
        dataSource: DataSource
    ) {
        super(Category, dataSource.createEntityManager())
    }
    async createCategory(category) {
        let result = await this.createQueryBuilder()
            .insert()
            .into(Category)
            .values([category])
            .execute()
        return result
    }
    async getAllCategory() {
        let result = await this.findAndCount({
            relations: {
                sub_category: true
            }
        })
        return result
    }
    async getOneCategory(id: number) {
        let result = await this.createQueryBuilder("category")
            .where("category.id = :id", { id: id })
            .leftJoinAndSelect("category.sub_category", "product")
            .getOne()
        return result
    }
}