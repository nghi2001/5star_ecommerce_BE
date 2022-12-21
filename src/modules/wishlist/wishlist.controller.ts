import { Body, CacheInterceptor, Controller, Delete, Get, HttpException, Param, Post, Query, Req, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { pager } from 'src/common/helper/paging';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseInterceptors(CacheInterceptor)
export class WishlistController {
    constructor(
        private WishLishService: WishlistService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body(new ValidationPipe()) body,
        @Req() req
    ) {
        let idUser = req.user.id;
        let result = await this.WishLishService.create(body, idUser);
        let data = await this.WishLishService.getOne(result.id);
        return data
    }

    @Get("")
    async shows(@Query() query) {
        let pagination = pager(query);
        let condition = await this.WishLishService.renderCondition(query)
        let data = await this.WishLishService.getList(condition, pagination);
        return data;
    }
    @Get(":id")
    async find(@Param("id") id: number) {
        let data = await this.WishLishService.getOne(id);
        if (!data) {
            throw new HttpException("id not found", 404);
        }
        return data;
    }

    @Delete(":id")
    async destroy(@Param("id") id: number) {
        let data = await this.WishLishService.destroy(id);
        return data;
    }

}
