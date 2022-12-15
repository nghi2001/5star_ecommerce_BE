import {
    Controller, Get, Post, Delete, Put,
    Body, HttpException, Param, UseGuards, Query, UseInterceptors, CacheInterceptor
} from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { pager } from 'src/common/helper/paging';
import { RolesGuard } from 'src/guards/roles.guard';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { BigBannerService } from './big-banner.service';
import { CreateBannerDTO } from './dto/createBanner.dto';
import { UpdateBannerDTO } from './dto/updateBanner.dto';

@Controller('banner')
@UseInterceptors(CacheInterceptor)
export class BigBannerController {
    constructor(
        private BannerService: BigBannerService
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post("")
    async create(
        @Body(new ValidationPipe()) createBannerDto: CreateBannerDTO
    ) {
        let newBanner = await this.BannerService.createBanner(createBannerDto);
        if (newBanner) {
            let banner = await this.BannerService.getOne(newBanner.raw[0].id);
            return banner;
        }
        return false
    }

    @Get()
    async show(
        @Query() query
    ) {
        let pagination = pager(query);
        let filter = await this.BannerService.renderCondition(query);
        let banners = await this.BannerService.getAll(filter, pagination);
        return banners;
    }

    @Get("/:id")
    async find(@Param("id") id) {
        let banner = await this.BannerService.getOne(id);
        return banner
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete("/:id")
    async destroy(@Param('id') id) {
        let result = await this.BannerService.deleteOne(id);
        return result
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body(new ValidationPipe()) body: UpdateBannerDTO
    ) {
        await this.BannerService.update(id, body);
        let banner = await this.BannerService.getOne(id);
        return banner

    }


}
