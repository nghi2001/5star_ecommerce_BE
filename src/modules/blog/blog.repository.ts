import { BaseRepository } from "src/common/base/BaseRepository";
import { Blog } from "src/entity/blog.entity";
import { DataSource, Repository } from "typeorm";

export class BlogRepository extends Repository<Blog> {
    constructor(
        private dataSource: DataSource
    ) {
        super(Blog, dataSource.createEntityManager())
    }

    async createBlog(blog) {
        let newBlog = await this.createQueryBuilder()
            .insert()
            .into(Blog)
            .values([blog])
            .execute()
        return newBlog;
    }
}