import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from "typeorm";
import { Stock } from "../../entity/stock.entity";

@Injectable()
export class StockRepository extends Repository<Stock> {
    constructor(dataSource: DataSource) {
        super(Stock, dataSource.createEntityManager())
    }

    async createStock(data) {
        let stock = await this.createQueryBuilder()
            .insert()
            .into(Stock)
            .values([data])
            .execute()
        return stock;
    }
    async createManyStock(data) {
        let stock = await this.createQueryBuilder()
            .insert()
            .into(Stock)
            .values(data)
            .execute()
        return stock;
    }

    async getStockById(id: number): Promise<any> {
        let productStock = await this.createQueryBuilder("stock")
            .leftJoin("stock.product", "product")
            .leftJoin("stock.classify_1", "classify_1")
            .leftJoin("stock.classify_2", "classify_2")
            .leftJoin("product.images", "images")
            .select([
                "stock.id",
                "stock.price",
                "stock.quantity",
                "product.id",
                "product.name",
                "images",
                'classify_1.attribute',
                'classify_2.attribute'
            ])
            .where("stock.id=:id ", { id: id })
            .getOne()
        return productStock;
    }
}