import {
    Controller, Get, Post, Delete,
    Req, Put, Param, ValidationPipe, Body, UseGuards, CacheInterceptor, UseInterceptors
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create_comment.dto';
import { UpdateCommentDto } from './dto/update_comment.dto';
import { Comment } from './interfaces/comment.interface';

@Controller('comment')
@UseInterceptors(CacheInterceptor)
export class CommentController {
    constructor(
        private CommentService: CommentService
    ) { }

    @Get(":id")
    async find(
        @Param('id') id: number
    ) {
        let comment = await this.CommentService.findOne(id);
        return comment;
    }

    @Get()
    async shows() {
        let comments = await this.CommentService.findAll();
        return comments;
    }

    @UseGuards(JwtAuthGuard)
    @Post("")
    async create(
        @Body(new ValidationPipe()) body: CreateCommentDto,
        @Req() req
    ) {
        let user_id = req.user.id;
        let newComment = await this.CommentService.createComment(body, user_id);
        let comment: Comment = {};
        if (newComment) {
            comment = await this.CommentService.getById(newComment.raw[0].id);
        }
        console.log(comment);

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
