import { Injectable } from '@nestjs/common';
import { Wishlish } from 'src/entity/wishlist.entity';
import { WishlistRepository } from './wishlist.repository';

@Injectable()
export class WishlistService {
    constructor(
        private WishListRepository: WishlistRepository
    ) { }

    async renderCondition(query) {
        let {
            id,
            id_user
        } = query;
        let condition: any = {};
        if (id) {
            condition.id = id;
        }
        if (id_user) {
            condition.id_user = id_user;
        }
        return condition

    }
    async create(data, idUser) {
        let wishlist = new Wishlish();
        wishlist.id_product = data.id_product;
        wishlist.id_user = idUser;
        let result = await this.WishListRepository.save(wishlist);
        return result
    }

    async getList(filter, pagination) {
        let data = await this.WishListRepository.getList(filter, pagination);
        return data;
    }

    async getOne(id: number) {
        let data = await this.WishListRepository.geyOne(id);
        return data;
    }

    async destroy(id: number) {
        let data = await this.WishListRepository.delete({ id });
        return data;
    }
}
