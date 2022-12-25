import {
    Controller,
    Post, Get, Delete, Put, UseGuards, Body, Param, UseInterceptors, CacheInterceptor, Query
} from '@nestjs/common';
import { Role } from 'src/common/enum';
import { orderBy } from 'src/common/helper/orderBy';
import { pager } from 'src/common/helper/paging';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { createCategoryDTO } from './dto/create-category.dto';
import { GetListDTO } from './dto/get-list.dto';

@Controller('category')
@UseInterceptors(CacheInterceptor)
export class CategoryController {

    constructor(
        private CategoryService: CategoryService
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    async store(@Body(new ValidationPipe()) createDto: createCategoryDTO) {
        let category = await this.CategoryService.createCategory(createDto);
        let newCategory = await this.CategoryService.getOne(category.raw[0].id);
        return newCategory
    }

    @Get()
    async show(@Query(new ValidationPipe()) query: GetListDTO) {
        let pagination = pager(query);
        let condition = await this.CategoryService.renderCondition(query);
        let constraintColumn = this.CategoryService.constraintColumn();
        let sort = orderBy(query, constraintColumn);
        let categorys = await this.CategoryService.getAll(condition, pagination, sort);
        return categorys
    }

    @Get(":id")
    async find(@Param("id") id: string) {
        let category = await this.CategoryService.getOne(id);
        return category;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(":id")
    async destroy(@Param('id') id: string) {
        let result = await this.CategoryService.deleteOne(id);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put(":id")
    async update(
        @Param('id') id: number,
        @Body(new ValidationPipe()) createDto: createCategoryDTO
    ) {
        let result = await this.CategoryService.updateCategory(id, createDto);
        return result
    }
}
