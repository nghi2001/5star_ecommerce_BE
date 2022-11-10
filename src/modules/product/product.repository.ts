import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Product } from "src/entity/product.entity";

@Injectable()
export class ProductRepository extends Repository<Product> {
    constructor(dataSource: DataSource) {
        super(Product, dataSource.createEntityManager())
    }

    async createProduct(product) {
        let result = await this.createQueryBuilder()
            .insert()
            .into(Product)
            .values([product])
            .execute()
        return result
    }
}