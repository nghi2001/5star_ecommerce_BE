import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { CreateRatingDTO } from './dto/create-rating.dto';
import { RatingRepository } from './rating.repository';

@Injectable()
export class RatingService {
    constructor(
        private RatingRepository: RatingRepository,
        private ProductService: ProductService
    ) { }

    async create(data: CreateRatingDTO, idUser: number) {
        let result = await this.RatingRepository.createRating(data, idUser);
        return result
    }

    async update(data) { }
}
