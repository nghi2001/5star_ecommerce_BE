import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { Sub_Category } from "src/entity/sub_category.entity";
import { createCategoryDTO } from './dto/create-category.dto';

@Injectable()
export class SubCategoryRepository extends Repository<Sub_Category> {

    constructor(
        dataSource: DataSource
    ) {
        super(Sub_Category, dataSource.createEntityManager())
    }

    async createSubCategory(category: createCategoryDTO) {
        let result = await this.createQueryBuilder()
            .insert()
            .into(Sub_Category)
            .values([category])
            .execute()
        return result
    }
}