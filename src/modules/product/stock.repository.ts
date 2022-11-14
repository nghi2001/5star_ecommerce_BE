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
}