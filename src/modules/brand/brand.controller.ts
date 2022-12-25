import { Body, CacheInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { pager } from '../../common/helper/paging';
import { orderBy } from 'src/common/helper/orderBy';
import { GetListDTO } from './dto/get-list.dto';

@Controller('brand')
@UseInterceptors(CacheInterceptor)
export class BrandController {
    constructor(
        private BrandService: BrandService
    ) { }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    async create(
        @Body(new ValidationPipe()) body: CreateBrandDto
    ) {
        let newBrand = await this.BrandService.create(body);
        return newBrand;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(":id")
    async destroy(@Param('id') id) {
        let result = await this.BrandService.delete(id);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put(":id")
    async update(
        @Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdateBrandDto
    ) {
        let result = await this.BrandService.update(id, body);
        return result;
    }

    @Get("")
    async shows(@Query(new ValidationPipe()) query: GetListDTO) {
        let pagination = pager(query);
        let conditon = await this.BrandService.renderCondition(query);
        let constraintColumn = this.BrandService.constraintColumn();
        let order = orderBy(query, constraintColumn)
        let data = await this.BrandService.getAll(conditon, pagination, order);
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
