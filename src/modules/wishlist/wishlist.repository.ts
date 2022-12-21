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
    async geyOne(id: number) {
        let data = await this.findOne({
            where: {
                id: id
            },
            relations: {
                products: {
                    images: true
                }
            },
            select: [

            ]
        })
        return data
    }
    async getList(filter, pagination) {
        let data = await this.find({
            where: filter,
            relations: {
                products: {
                    images: true
                }
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