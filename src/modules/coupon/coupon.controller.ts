import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { pager } from 'src/common/helper/paging';
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
        let newCoupon = null;
        let data = await this.CouponService.create(body);
        if (data) {
            newCoupon = await this.CouponService.getById(data.raw[0].id);
        }
        return newCoupon;
    }

    @Get(":id")
    async find(@Param("id") id: number) {
        let data = await this.CouponService.getById(id);
        return data
    }
    @Get()
    async shows(@Query() query) {
        let paging = pager(query);
        let data = await this.CouponService.getList({}, paging);
        return data
    }

    @Put(":id")
    async update(
        @Param('id') id: number,
        @Body(new ValidationPipe()) body: CreateCouponDTO
    ) {
        let data = await this.CouponService.update(id, body);
        return data;
    }
    @Delete(":id")
    async destroy(@Param("id") id: number) {
        let data = await this.CouponService.destroy(id);
        if (data.affected != 1) {
            throw new HttpException("id not found", 404);
        }
        return data
    }


}
