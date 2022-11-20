import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import redisClient from '../../config/database/redis';
import { ProductService } from '../product/product.service';
import { createCartDto } from './dto/create_cart.dto';

@Injectable()
export class CartService {
    prefixCart: string;
    constructor(
        private configService: ConfigService,
        private ProductService: ProductService
    ) {
        this.prefixCart = this.configService.get("PREFIX_CARt");
    }

    async getCartBy(idUser: number) {
        let cartId = this.prefixCart + idUser;
        let cart = await redisClient.hgetall(cartId);
        let keys = Object.keys(cart);
        let cartItems: any[] = []
        console.log(keys);

        for (let key of keys) {
            let idProduct = key.split(':')[1];
            let product = await this.ProductService.getStockById(Number(idProduct));
            if (!product) {
                await redisClient.hdel(cartId, key);
                return;
            }

            let cartItem = {
                ...product,
                quantity: cart[key]
            }
            cartItems.push(cartItem);
        }

        return cartItems;
    }

    async create(idUser: string, cart: createCartDto) {
        let cartId = `${this.prefixCart}${idUser}`;
        let productKey = `product:${cart.id_product}`;
        let checkProductExist = await this.ProductService.checkStockExist(cart.id_product);
        if (checkProductExist) {
            console.log(cartId);

            let prodQuantity = await redisClient.hincrby(cartId, productKey, cart.quantity);
            if (Number(prodQuantity) <= 0) {
                await redisClient.hdel(cartId, productKey);
            }
            let productInCart = await redisClient.hget(cartId, productKey);
            return {
                product: cart.id_product,
                quantity: productInCart
            }
        }
    }
}
