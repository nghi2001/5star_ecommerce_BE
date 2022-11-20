import {
    Controller, Get, Post, Delete, Put,
    Body, HttpException, Param, UseGuards
} from '@nestjs/common';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { BigBannerService } from './big-banner.service';
import { CreateBannerDTO } from './dto/createBanner.dto';

@Controller('banner')
export class BigBannerController {
    constructor(
        private BannerService: BigBannerService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post("")
    async create(
        @Body(new ValidationPipe()) createBannerDto: CreateBannerDTO
    ) {
        let newBanner = await this.BannerService.createBanner(createBannerDto);
        return newBanner
    }

    @Get()
    async show() {
        let banners = await this.BannerService.getAll();
        return banners;
    }

    @Get("/:id")
    async find(@Param("id") id) {
        let banner = await this.BannerService.getOne(id);
        return banner
    }

    @UseGuards(JwtAuthGuard)
    @Delete("/:id")
    async destroy(@Param('id') id) {
        let result = await this.BannerService.deleteOne(id);
        return result
    }

    @UseGuards(JwtAuthGuard)
    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body(new ValidationPipe()) createDto: CreateBannerDTO
    ) {
        let result = await this.BannerService.update(id, createDto);
        return result
    }


}
