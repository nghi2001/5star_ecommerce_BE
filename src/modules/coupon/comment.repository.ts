import { Injectable } from "@nestjs/common/decorators"
import { DataSource, Repository } from "typeorm"
import { Coupon } from "src/entity/coupon.entity"
@Injectable()
export class CouponRepository extends Repository<Coupon>{
    constructor(dataSource: DataSource) {
        super(Coupon, dataSource.createEntityManager())
    }


}