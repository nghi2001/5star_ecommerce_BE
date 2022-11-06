import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { identity } from 'rxjs';
import { createCategoryDTO } from './dto/create-category.dto';
import { updateCategoryDTO } from './dto/update-category.dto';
import { SubcategoryService } from './subcategory.service';

@Controller('subcategory')
export class SubcategoryController {
    constructor(
        private SubCategoryService: SubcategoryService
    ){}

    @Get()
    async shows() {
        let data = await this.SubCategoryService.getAll();
        return data;
    }

    @Get(":id")
    async find(@Param('id') id) {
        let data = await this.SubCategoryService.getOne(id);
        return data;
    }

    @Post()
    async create(
        @Body(new ValidationPipe()) body: createCategoryDTO
    ) {
        let data = await this.SubCategoryService.create(body);
        return data
    }

    @Delete(":id")
    async destroy(@Param('id') id) {
        let result = await this.SubCategoryService.delete(id);
        return result
    }

    @Put(":id")
    async update(
        @Param('id') id,
        @Body(new ValidationPipe()) body: updateCategoryDTO
    ) {
        let data = await this.update(id, body);
        return data;
    }
}
