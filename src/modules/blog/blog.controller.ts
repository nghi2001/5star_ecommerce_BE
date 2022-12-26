import {
    Body, Controller, Delete, Get, Param, Post,
    Req, Put, UseGuards, ValidationPipe, UseInterceptors, CacheInterceptor, Query
} from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role, TYPE_ORDER } from 'src/common/enum';
import { orderBy } from 'src/common/helper/orderBy';
import { pager } from 'src/common/helper/paging';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CommentService } from '../comment/comment.service';
import { BlogService } from './blog.service';
import { CreateBlogDTO } from './dto/createBlogDTO';
import { GetListDTO } from './dto/get-list.dto';
import { UpdateBlogDTO } from './dto/updateBlogDTO';
import { Request } from 'express';
import redis from 'src/config/database/redis';

@Controller('blog')
@UseInterceptors(CacheInterceptor)
export class BlogController {

    constructor(
        private BlogService: BlogService,
        private CommentService: CommentService
    ) { }

    @Get("/:idSlug")
    async find(
        @Param("idSlug") id_slug: string,
        @Req() req: Request
    ) {
        let fingerprint: any = req.fingerprint
        let hash = fingerprint.hash;
        let data = null;
        let id = Number(id_slug);
        if (id) {
            data = await this.BlogService.findOne(id);
        } else {
            data = await this.BlogService.getOneBySlug(id_slug);
        }
        if (!(await redis.get(hash) == data.id)) {
            data.views += 1;
            await data.save();
            await redis.set(hash, data.id, 'EX', 60)
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
    async shows(@Query(new ValidationPipe()) query: GetListDTO) {
        let pagination = pager(query);
        let condition = await this.BlogService.renderCondition(query);
        let constraintColumn = this.BlogService.constraintColumn();
        let order = orderBy(query, constraintColumn);
        let blogs = await this.BlogService.findAll(condition, pagination, order);
        return blogs;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post("")
    async create(
        @Body(new ValidationPipe()) createData: CreateBlogDTO,
        @Req() req
    ) {
        let id = req.user.id;

        let newBlog = await this.BlogService.create(createData, id);
        let blog = await this.BlogService.findOne(newBlog.raw[0].id);

        return blog;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(":id")
    async destroy(@Param('id') id: number) {
        let result = await this.BlogService.delete(id);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
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
