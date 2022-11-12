import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create_comment.dto';
import { UpdateCommentDto } from './dto/update_comment.dto';
import { Comment } from './interfaces/comment.interface';
@Injectable()
export class CommentService {
    constructor(
        private CommentRepository: CommentRepository
    ) {

    }
    paging(filters) {
        let options
        if (filters.perPage && !isNaN(filters.perPage)) {
            options.take = filters.perPage > 100 ? 100 : filters.perPage * 1;
            if (filters.full == 'true') {
                options.take = 1;
            }
        } else {
            options.take = 20;
        }
        if (filters.page > 0) {
            options.skip = (filters.page - 1) * options.limits
        } else {
            options.skip = 0;
        }
        return options;
    }

    async createComment(comment: CreateCommentDto, creator_id: number) {
        if (comment.parent_id) {
            await this.checkCommentExist(comment.parent_id);
        }
        let newComment = await this.CommentRepository.createComment(comment, creator_id);
        return newComment;
    }

    async findAll(query?: Object) {
        let comments = await this.CommentRepository.findAndCountChild();
        return comments;
    }
    async findOne(id: number) {
        let check = await this.checkCommentExist(id);
        if (check) {
            let comment = await this.CommentRepository.getOneComment(id);
            console.log(comment);

            return comment
        }
    }

    async getById(id: number) {
        let comment = await this.checkCommentExist(id);
        if (comment) {
            let result = await this.CommentRepository.findOneBy({ id });
            return result;
        }
    }
    async destroy(id: number) {
        let comment = await this.checkCommentExist(id);
        if (comment) {
            let result = await this.CommentRepository.delete({ id });
            return true;
        }
        return false
    }
    async update(id: number, data: UpdateCommentDto) {
        let comment = await this.checkCommentExist(id);
        if (comment) {
            let updateData: Comment = {};
            if (data.body && data.body != comment.body) {
                updateData.body = data.body
            }
            if (Object.keys(updateData).length == 0) {
                return false
            }
            let result = await this.CommentRepository.update({ id }, updateData);
            return result;
        }
    }
    async checkValidId(id: number) {
        if (!Number(id) || id < 0) {
            throw new HttpException("id invalid", HttpStatus.BAD_REQUEST);
        }
        return true
    }
    async checkCommentExist(id: number) {
        let [errId, data] = await this.checkValidId(id).then(data => [null, data]).catch(errId => [errId, null]);
        if (errId) {
            throw new HttpException("id invalid", HttpStatus.BAD_GATEWAY)
        }
        let comment = await this.CommentRepository.findOneBy({ id });
        if (comment) {
            return comment;
        }
        throw new HttpException("comment not found", HttpStatus.NOT_FOUND);
    }

    async getByBlog(idBlog: number) {
        let comments = await this.CommentRepository.findAndCountChildByBlog(idBlog);
        return comments
    }
}
