import { Injectable } from "@nestjs/common/decorators"
import { DataSource, Repository } from "typeorm"
import { Coupon } from "src/entity/coupon.entity"
@Injectable()
export class CouponRepository extends Repository<Coupon>{
    constructor(dataSource: DataSource) {
        super(Coupon, dataSource.createEntityManager())
    }

    async createCoupon(coupon) {
        let data = await this.createQueryBuilder()
            .insert()
            .into(Coupon)
            .values([{ ...coupon }])
            .execute();
        return data;
    }

    async getOne(fillter) {
        let data = await this.findOne({
            where: {
                ...fillter
            }
        });
        return data;
    }


    async getList(filter, pagination) {
        let data = await this.find({
            where: {
                ...filter
            },
            ...pagination
        })
        let total = await this.count({
            where: {
                ...filter
            }
        })
        return {
            total: total,
            data: data
        };
    }
}