import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { CreateRatingDTO } from './dto/create-rating.dto';
import { UpdateRatingDTO } from './dto/update-rating.dto';
import { RatingRepository } from './rating.repository';

@Injectable()
export class RatingService {
    constructor(
        private RatingRepository: RatingRepository,
        private ProductService: ProductService
    ) { }

    async renderCondition(query) {
        let {
            id_product,
            status,
            id_user,
            rating
        } = query;
        let condition: any = {};
        if (id_product) {
            condition.id_product = id_product
        }
        if (status) {
            condition.status = status;
        }
        if (id_user) {
            condition.id_user = id_user;
        }
        if (rating) {
            condition.rating = rating;
        }
        return condition
    }
    async create(data: CreateRatingDTO, idUser: number) {
        let result = await this.RatingRepository.createRating(data, idUser);
        return result
    }

    async update(data: UpdateRatingDTO, id: number) {
        let result = await this.RatingRepository.update({ id: id }, data);
        return result;
    }

    async shows(filter = {}, pagination = {}) {
        let data = await this.RatingRepository.getList(filter, pagination);
        return data
    }

    async getOne(id: number) {
        let data = await this.RatingRepository.findOneBy({ id });
        return data;
    }

    async getStatistic(idProduct: number) {
        let data = await this.RatingRepository.getStatistic(idProduct);
        let arr = [0, 0, 0, 0, 0];
        let count = 0;
        let sum = 0;
        for (let i of data) {
            if (i.rating % 1 == 0) {
                arr[i.rating - 1] = i.count
            }
        }
        console.log(arr);
        arr.forEach((val, ind) => {
            console.log(val);

            count += Number(val);
            sum += val * (ind + 1)
        })
        let rating = sum / count;

        return {
            rating: rating,
            data
        }
    }
}
