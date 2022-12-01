import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brand')
export class BrandController {
    constructor(
        private BrandService: BrandService
    ) { }


    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body(new ValidationPipe()) body: CreateBrandDto
    ) {
        let newBrand = await this.BrandService.create(body);
        return newBrand;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async destroy(@Param('id') id) {
        let result = await this.BrandService.delete(id);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Put(":id")
    async update(
        @Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdateBrandDto
    ) {
        let result = await this.BrandService.update(id, body);
        return result;
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
