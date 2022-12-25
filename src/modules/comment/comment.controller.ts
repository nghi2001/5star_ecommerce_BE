import {
    Controller, Get, Post, Delete,
    Req, Put, Param, ValidationPipe, Body, UseGuards, CacheInterceptor, UseInterceptors, HttpException, Query
} from '@nestjs/common';
import { TYPE_NOTIFY } from 'src/common/enum';
import { to } from 'src/common/helper/catchError';
import { pager } from 'src/common/helper/paging';
import { EventsGateway } from 'src/events/events.gateway';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { BlogService } from '../blog/blog.service';
import { NotifyService } from '../notify/notify.service';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create_comment.dto';
import { UpdateCommentDto } from './dto/update_comment.dto';
import { Comment } from './interfaces/comment.interface';

@Controller('comment')
@UseInterceptors(CacheInterceptor)
export class CommentController {
    constructor(
        private CommentService: CommentService,
        private EventService: EventsGateway,
        private BlogService: BlogService,
        private NotifyService: NotifyService
    ) { }

    @Get(":id")
    async find(
        @Param('id') id: number
    ) {
        let comment = await this.CommentService.findOne(id);
        return comment;
    }

    @Get()
    async shows(@Query() query) {
        let pagination = pager(query);
        let condiion = await this.CommentService.renderCondition(query)
        let comments = await this.CommentService.getList(condiion, pagination);
        return comments;
    }

    @UseGuards(JwtAuthGuard)
    @Post("")
    async create(
        @Body(new ValidationPipe()) body: CreateCommentDto,
        @Req() req
    ) {
        let user_id = req.user.id;
        await this.BlogService.checkBlogExist(body.blog_id)
        if (body.parent_id) {
            let [err] = await to(this.CommentService.getById(body.parent_id));
            if (err) {
                throw new HttpException("parent_id not found", 404);
            }
        }
        let newComment = await this.CommentService.createComment(body, user_id);
        let comment: Comment = {};
        if (newComment) {
            comment = await this.CommentService.getById(newComment.raw[0].id);
            if (comment.parent_id) {
                let data = await this.CommentService.findOne(comment.parent_id);
                console.log(data);

                let content = `${req.user.name} đã trả lời bình luận của bạn`
                this.NotifyService.create({
                    content: content,
                    to: [data.user_id],
                    type: TYPE_NOTIFY.USER
                })
            }
        }

        return comment;
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdateCommentDto
    ) {
        let result = await this.CommentService.update(id, body);
        if (!result) {
            return 0
        }
        let comment = await this.CommentService.findOne(id);
        return comment
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async destroy(@Param("id") id: number) {
        let result = await this.CommentService.destroy(id);
        if (!result) {
            return 0
        }
        return 1
    }

}
