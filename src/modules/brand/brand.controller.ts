import { Body, CacheInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { pager } from '../../common/helper/paging';

@Controller('brand')
@UseInterceptors(CacheInterceptor)
export class BrandController {
    constructor(
        private BrandService: BrandService
    ) { }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post()
    async create(
        @Body(new ValidationPipe()) body: CreateBrandDto
    ) {
        let newBrand = await this.BrandService.create(body);
        return newBrand;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(":id")
    async destroy(@Param('id') id) {
        let result = await this.BrandService.delete(id);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put(":id")
    async update(
        @Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdateBrandDto
    ) {
        let result = await this.BrandService.update(id, body);
        return result;
    }

    @Get("")
    async shows(@Query() query) {
        let pagination = pager(query);
        let conditon = await this.BrandService.renderCondition(query);
        let data = await this.BrandService.getAll(conditon, pagination);
        return data
    }

    @Get(":idSlug")
    async find(@Param('idSlug') idSlug: string) {
        let id = Number(idSlug);
        let brand = null;
        if (id) {
            brand = await this.BrandService.getOne(id);
        } else {
            brand = await this.BrandService.getBySlug(idSlug);
        }
        return brand;
    }
}
