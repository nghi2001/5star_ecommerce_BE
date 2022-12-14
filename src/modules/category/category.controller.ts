import {
    Controller,
    Post, Get, Delete, Put, UseGuards, Body, Param
} from '@nestjs/common';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { createCategoryDTO } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {

    constructor(
        private CategoryService: CategoryService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async store(@Body(new ValidationPipe()) createDto: createCategoryDTO) {
        let category = await this.CategoryService.createCategory(createDto);
        let newCategory = await this.CategoryService.getOne(category.raw[0].id);
        return newCategory
    }

    @Get()
    async show() {
        let categorys = await this.CategoryService.getAll();
        return categorys
    }

    @Get(":id")
    async find(@Param("id") id: string) {
        let category = await this.CategoryService.getOne(id);
        return category;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async destroy(@Param('id') id: string) {
        let result = await this.CategoryService.deleteOne(id);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Put(":id")
    async update(
        @Param('id') id: number,
        @Body(new ValidationPipe()) createDto: createCategoryDTO
    ) {
        let result = await this.CategoryService.updateCategory(id, createDto);
        return result
    }
}
