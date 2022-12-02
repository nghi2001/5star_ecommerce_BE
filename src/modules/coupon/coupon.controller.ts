import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDTO } from './dto/create-coupon.dto';

@Controller('coupon')
export class CouponController {
    constructor(
        private CouponService: CouponService
    ) {

    }

    @Post()
    async create(
        @Body(new ValidationPipe()) body: CreateCouponDTO
    ) {
        let data = await this.CouponService.create(body);
    }
}
