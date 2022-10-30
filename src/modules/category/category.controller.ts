import {
    Controller,
    Post, Get, Delete, Put, UseGuards, Body, Param
} from '@nestjs/common';
import { ValidationPipe } from 'src/common/pipe/validation.pipe';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { createCategoryDTO } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {

    constructor(
        private CategoryService: CategoryService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body(new ValidationPipe()) createDto: createCategoryDTO) {
        let newCategory = await this.CategoryService.createCategory(createDto);
        return newCategory;
    }
    @UseGuards(JwtAuthGuard)
    @Post("/:id")
    async createSub(
        @Param("id") id: string
        , @Body(new ValidationPipe()) createDto: createCategoryDTO
    ) {
        let newCategory = await this.CategoryService.addSubCategory(id, createDto);
        return newCategory;
    }
    @Get()
    async show() {
        let categorys = await this.CategoryService.getAll();
        return categorys
    }


    @Get("/sub/:idParent/:id")
    async findSub(
        @Param("idParent") idParent: string,
        @Param("id") id: string) {

        let category = await this.CategoryService.getOneSub(idParent, id);

        return category;
    }
    @Get(":id")
    async find(@Param("id") id: string) {
        let category = await this.CategoryService.getOne(id);
        return category;
    }

    @UseGuards(JwtAuthGuard)
    @Delete("/sub/:idParent/:id")
    async destroySub(
        @Param("idParent") idParent: string,
        @Param("id") id: string
    ) {
        let result = await this.CategoryService.deleteSubCategory(idParent, id);
        return result
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async destroy(@Param('id') id: string) {
        let result = await this.CategoryService.deleteOne(id);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Put("/sub/:idParent/:id")
    async updateSub(
        @Param("idParent") idParent: string,
        @Param("id") id: string,
        @Body(new ValidationPipe()) createDto: createCategoryDTO
    ) {
        let result = await this.CategoryService.updateSubCategoty(idParent, id, createDto);
        return result
    }

    @UseGuards(JwtAuthGuard)
    @Put(":id")
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe()) createDto: createCategoryDTO
    ){
        let result = await this.CategoryService.updateCategory(id,createDto);
        return result
    }
}
