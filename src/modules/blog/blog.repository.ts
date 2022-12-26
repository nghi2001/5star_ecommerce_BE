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

    async getAll(filter: any = {}, pagination: any = {}, order = {}) {
        let query = this.createQueryBuilder("blog");
        Object.keys(filter).forEach((key) => {
            if (filter[key]) {
                let value: any = {};
                value[`${key}`] = filter[key]
                console.log(value);
                if (key == 'title') {
                    query.andWhere(`similarity(unaccent(blog.${key}),unaccent(:${key})) > 0.2`, value)
                } else {
                    query.andWhere(`blog.${key} = :${key}`, value)
                }
            }
        })
        Object.keys(order).forEach(key => {
            query.addOrderBy(`blog.${key}`, order[key])
        })
        let total = await query.getCount();
        query
            .leftJoin("blog.media", "media")
            .leftJoin("blog.user", "user")
            .select([
                "blog",
                "media",
                "user"
            ])
            .take(pagination.take)
            .skip(pagination.skip)
        let data = await query.getMany()
        return {
            total: total,
            data: data
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

    async getOneBySlug(slug: string) {
        let data = await this.findOne({
            where: {
                slug: slug
            },
            relations: {
                media: true
            }
        })
        return data;
    }

    async updateBlog(id, dataUpdate) {
        let data = await this.createQueryBuilder()
            .update()
            .set(dataUpdate)
            .where("id = :id", { id: id })
            .execute();
        return data;
    }
}