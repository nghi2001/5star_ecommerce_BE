import { Injectable } from "@nestjs/common/decorators";
import { Blog } from "../../entity/blog.entity";
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

    async getAll(filter = {}, pagination = {}) {
        let data = await this.find({
            where: filter,
            relations: {
                media: true
            },
            ...pagination
        });
        let total = await this.count({
            where: filter
        })
        return {
            data: data,
            total: total
        }
    }

    async getOne(id: number) {
        let data = await this.findOne({
            where: {
                id: id
            },
            relations: {
                media: true
            }
        })
        return data;
    }
}