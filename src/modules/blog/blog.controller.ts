import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDTO } from './dto/createBlogDTO';
import { UpdateBlogDTO } from './dto/updateBlogDTO';

@Controller('blog')
export class BlogController {

    constructor(
        private BlogService: BlogService
    ) { }
    @Get("/")
    async shows() {
        let blogs = await this.BlogService.findAll();
        return blogs;
    }
    @Post("")
    async create(
        @Body(new ValidationPipe()) body: CreateBlogDTO
    ) {
        let newBlog = await this.BlogService.create(body);
        return newBlog;
    }

    @Delete(":id")
    async destroy(@Param('id') id: number) {
        let result = await this.BlogService.delete(id);
        return result;
    }

    @Put(":id")
    async update(
        @Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdateBlogDTO
    ) {
        let result = await this.BlogService.update(id, body);
        return result
    }
}
