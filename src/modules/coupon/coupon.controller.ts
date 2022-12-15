import { Body, CacheInterceptor, Controller, Delete, Get, HttpException, Param, Post, Put, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { pager } from 'src/common/helper/paging';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CouponService } from './coupon.service';
import { CreateCouponDTO } from './dto/create-coupon.dto';

@Controller('coupon')
@UseInterceptors(CacheInterceptor)
export class CouponController {
    constructor(
        private CouponService: CouponService
    ) {

    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
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
        let filter = await this.CouponService.renderCondition(query);
        let data = await this.CouponService.getList(filter, paging);
        return data
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put(":id")
    async update(
        @Param('id') id: number,
        @Body(new ValidationPipe()) body: CreateCouponDTO
    ) {
        let data = await this.CouponService.update(id, body);
        return data;
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(":id")
    async destroy(@Param("id") id: number) {
        let data = await this.CouponService.destroy(id);
        if (data.affected != 1) {
            throw new HttpException("id not found", 404);
        }
        return data
    }


}
