import {
    Body, Controller, Delete, Get, Param, Post,
    Req, Put, UseGuards, ValidationPipe, UseInterceptors, CacheInterceptor
} from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CommentService } from '../comment/comment.service';
import { BlogService } from './blog.service';
import { CreateBlogDTO } from './dto/createBlogDTO';
import { UpdateBlogDTO } from './dto/updateBlogDTO';

@Controller('blog')
@UseInterceptors(CacheInterceptor)
export class BlogController {

    constructor(
        private BlogService: BlogService,
        private CommentService: CommentService
    ) { }

    @Get("/:idSlug")
    async find(
        @Param("idSlug") id_slug: string
    ) {
        let data = null;
        let id = Number(id_slug);
        if (id) {
            data = await this.BlogService.findOne(id);
        } else {
            data = await this.BlogService.getOneBySlug(id_slug);
        }
        return data;
    }
    @Get("/:id/comment")
    async getComment(@Param('id') id: number) {
        let checkId = await this.BlogService.checkBlogExist(id);
        if (checkId) {
            let comments = await this.CommentService.getByBlog(id);
            return comments
        }
    }

    @Get("/")
    async shows() {
        let blogs = await this.BlogService.findAll();
        return blogs;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post("")
    async create(
        @Body(new ValidationPipe()) createData: CreateBlogDTO,
        @Req() req
    ) {
        let {
            content,
            title,
            image
        } = createData;
        let id = req.user.id;

        let newBlog = await this.BlogService.create({ content, title, image }, id);
        let blog = await this.BlogService.findOne(newBlog.raw[0].id);

        return blog;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(":id")
    async destroy(@Param('id') id: number) {
        let result = await this.BlogService.delete(id);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put(":id")
    async update(
        @Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdateBlogDTO
    ) {
        let result = await this.BlogService.update(id, body);
        let blog = {}
        if (result.affected != 0) {
            blog = await this.BlogService.findOne(id);
        }
        return blog
    }
}
