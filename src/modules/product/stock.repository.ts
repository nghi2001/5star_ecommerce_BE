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

    async getStockById(id: number) {
        let productStock = await this.createQueryBuilder("stock")
            .leftJoin("stock.product", "product")
            .where("stock.id=:id ", { id: id })
            .leftJoin("stock.classify_1", "classify_1")
            .leftJoin("stock.classify_2", "classify_2")
            .select([
                "stock.id",
                "stock.price",
                "stock.quantity",
                "product.name",
                'classify_1.attribute',
                'classify_2.attribute'
            ])
            .getOne()
        return productStock;
    }
}