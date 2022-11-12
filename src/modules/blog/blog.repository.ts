import { Injectable } from "@nestjs/common/decorators";
import { Blog } from "src/entity/blog.entity";
import { DataSource, Repository } from "typeorm";
import { CreateBlogDTO } from "./dto/createBlogDTO";

@Injectable()
export class BlogRepository extends Repository<Blog> {
    constructor(
        dataSource: DataSource
    ) {
        super(Blog, dataSource.createEntityManager())
    }

    async createBlog(blog: CreateBlogDTO, user_id: number) {
        let newBlog = await this.createQueryBuilder()
            .insert()
            .into(Blog)
            .values([{ ...blog, user_id }])
            .execute();

        return newBlog;
    }
}