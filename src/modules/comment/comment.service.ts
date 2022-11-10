import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create_comment.dto';

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

    async createComment(comment: CreateCommentDto) {
        let newComment = await this.CommentRepository.createComment(comment);
        return newComment;
    }

    async findAll(query) {
        let comments = await this.CommentRepository.findAndCount({});

    }

}
