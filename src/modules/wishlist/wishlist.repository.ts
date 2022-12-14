import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from 'typeorm';
import { Wishlish } from "../../entity/wishlist.entity";

@Injectable({

})
export class WishlistRepository extends Repository<Wishlish> {

    constructor(
        private dataSource: DataSource
    ) {
        super(Wishlish, dataSource.createEntityManager())
    }

    async getList(filter, pagination) {
        let data = await this.find({
            where: filter,
            relations: {
                users: true,
                stocks: true
            },
            order: {
                id: 'ASC'
            },
            ...pagination
        });
        let total = await this.count({
            where: filter
        });
        return {
            total,
            data
        }
    }
}