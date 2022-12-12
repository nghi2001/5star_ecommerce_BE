import {
    Controller,
    Post, Get, Delete, Put, UseGuards, Body, Param, UseInterceptors, CacheInterceptor
} from '@nestjs/common';
import { Role } from 'src/common/enum/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { createCategoryDTO } from './dto/create-category.dto';

@Controller('category')
@UseInterceptors(CacheInterceptor)
export class CategoryController {

    constructor(
        private CategoryService: CategoryService
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(":id")
    async destroy(@Param('id') id: string) {
        let result = await this.CategoryService.deleteOne(id);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put(":id")
    async update(
        @Param('id') id: number,
        @Body(new ValidationPipe()) createDto: createCategoryDTO
    ) {
        let result = await this.CategoryService.updateCategory(id, createDto);
        return result
    }
}
