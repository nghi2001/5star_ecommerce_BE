import { DataSource, Repository } from "typeorm"
import { CreateCommentDto } from "./dto/create_comment.dto"


export class CommentRepository extends Repository<Comment>{
    constructor(dataSource: DataSource) {
        super(Comment, dataSource.createEntityManager())
    }

    async createComment(comment: CreateCommentDto) {
        let newComment = await this.createQueryBuilder()
            .insert()
            .into(Comment)
            .values([comment])
            .execute()
        return newComment
    }
}