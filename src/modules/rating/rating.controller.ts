import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { get } from 'http';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum';
import { to } from 'src/common/helper/catchError';
import { pager } from 'src/common/helper/paging';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { CreateRatingDTO } from './dto/create-rating.dto';
import { UpdateRatingDTO } from './dto/update-rating.dto';
import { RatingService } from './rating.service';

@Controller('rating')
export class RatingController {
    constructor(
        private ProductService: ProductService,
        private RatingService: RatingService,
        private OrderService: OrderService
    ) {

    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Get("/count")
    async countRate() {
        let [err, count] = await to(this.RatingService.countRate());
        if (err) {
            console.log("Err Count Rate", err);
            return null
        }
        return {
            total: count
        }
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Req() req,
        @Body(new ValidationPipe()) body: CreateRatingDTO) {
        let userId = req.user.id;
        if (body.id_product) {
            let checkData = await this.ProductService.checkProdExist(body.id_product);
            let ids = checkData.stocks.map(value => {
                return value.id
            })
            let checkUserIsOrder = await this.OrderService.checkUserIsOrder(userId, ids);
            if (!checkUserIsOrder) {
                throw new HttpException("User is not allowed to rate", HttpStatus.FORBIDDEN)
            }
        }
        let data = await this.RatingService.create(body, userId);
        return data;
    }

    @Get()
    async shows(@Query() query) {
        let pagination = pager(query);
        let condition = await this.RatingService.renderCondition(query);
        let data = await this.RatingService.shows(condition, pagination);
        return data;
    }

    @Get("/:id_product/statistic")
    async getStatistic(@Param("id_product") idProduct: number) {
        let data = await this.RatingService.getStatistic(idProduct);
        return data;
    }
    @Get(":id")
    async find(@Param("id") id: number) {
        let data = await this.RatingService.getOne(id);
        return data || null
    }

    @Put(":id")
    async update(
        @Body(new ValidationPipe()) body: UpdateRatingDTO,
        @Param("id") id: number) {
        await this.RatingService.update(body, id);
        let data = await this.RatingService.getOne(id);
        return data
    }
}
