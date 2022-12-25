import { Injectable } from "@nestjs/common"
import { Rating } from "src/entity/rating.entity"
import { DataSource, Repository } from "typeorm"
import { CreateRatingDTO } from "./dto/create-rating.dto"

@Injectable()
export class RatingRepository extends Repository<Rating> {
    constructor(dataSource: DataSource) {
        super(Rating, dataSource.createEntityManager())
    }
    async createRating(data: CreateRatingDTO, idUser: number) {
        let rating = new Rating();
        rating.id_product = data.id_product;
        rating.rating = data.rating;
        rating.content = data.content;
        rating.id_user = idUser;
        await rating.save();
        return rating;
    }

    async getStatistic(idProduct) {
        let data = await this.createQueryBuilder("rate")
            .where("rate.id_product = :idProduct", { idProduct: idProduct })
            .select("rating")
            .addSelect('COUNT(rate.id)', 'count')
            .groupBy("rating")
            .getRawMany();
        return data
    }
    async getList(filter = {}, pagination = {}) {
        let query = this.createQueryBuilder("rating");
        query
            .leftJoin("rating.product", "product")
            .leftJoin("rating.user", "user")
            .leftJoin("user.avatar", "avatar")
            .select([
                "rating",
                "product.id",
                "user",
                "avatar"
            ])
        Object.keys(filter).forEach(key => {
            let value = {};
            value[key] = filter[key]
            query.andWhere(`rating.${key} = :${key}`, value);
        })
        query.take(pagination['take']);
        query.skip(pagination['skip']);
        let data = await query.getMany()
        let total = await query.getCount();
        return {
            total,
            data
        }
    }
    async getOne(id: number) {
        let data = this.findOne({
            where: {
                id: id
            },
            relations: {
                product: true,
                user: {
                    avatar: true
                }
            }
        })
        return data
    }
}