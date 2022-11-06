import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brand')
export class BrandController {
    constructor(
        private BrandService: BrandService
    ){}

    @Post()
    async create(
        @Body(new ValidationPipe()) body: CreateBrandDto
    ) {
        let newBrand = await this.BrandService.create(body);
        return newBrand;
    }

    @Delete(":id")
    async destroy (@Param('id') id) {
        let result = await this.BrandService.delete(id);
        return result;
    }

    @Put(":id")
    async update(
        @Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdateBrandDto
    ){
        let result = await this.BrandService.update(id, body);
        return result;
    }

    @Get(":id")
    async find(@Param('id') id) {
        let brand = await this.BrandService.getOne(id);
        return brand;
    }
}
