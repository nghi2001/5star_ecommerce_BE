import { Injectable } from "@nestjs/common/decorators"
import { DataSource, Repository } from "typeorm"
import { CreateCommentDto } from "./dto/create_comment.dto"
import { Comment } from "../../entity/comment.entity"

@Injectable()
export class CommentRepository extends Repository<Comment>{
    constructor(dataSource: DataSource) {
        super(Comment, dataSource.createEntityManager())
    }

    async createComment(comment: CreateCommentDto, creator_id) {
        let newComment = await this.createQueryBuilder()
            .insert()
            .into(Comment)
            .values([{ ...comment, user_id: creator_id }])
            .execute()
        return newComment
    }

    async getOneComment(id: number) {
        let comment = await this.findOne({
            where: {
                id: id
            },
            relations: {
                blog: true,
                profile: true,
                childComment: true
            }
        })
        return comment;
    }

    async getList(filter = {}, pagination = {}) {
        let data = await this.find({
            where: filter,
            relations: {
                blog: true,
                profile: true,
                childComment: true
            },
            ...pagination
        });
        let total = await this.count({
            where: filter
        });
        return {
            total,
            data
        }
    }
    async findAndCountChild() {
        let comments = await this.createQueryBuilder('comment')
            .loadRelationCountAndMap('comment.childComment', 'comment.childComment')
            .getMany();
        return comments
    }

    async findAndCountChildByBlog(idBlog: number) {
        let comments = await this.createQueryBuilder('comment')
            .where("comment.blog_id = :id", { id: idBlog })
            .loadRelationCountAndMap('comment.childComment', 'comment.childComment')
            .getMany();
        return comments
    }
}