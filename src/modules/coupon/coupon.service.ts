import { Injectable } from '@nestjs/common';
import { CouponRepository } from './coupon.repository';
import { CreateCouponDTO } from './dto/create-coupon.dto';

@Injectable()
export class CouponService {
    constructor(private CouponRepository: CouponRepository) {

    }

    async create(coupon: CreateCouponDTO) {
        let dataInsert = {
            code,
            expirate_date,
            start_date,
            quantity,
            type,
            discount,
            min_order,
            max_order
        } = coupon
    }
}
