import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import redisClient from '../../config/database/redis';
import { ProductService } from '../product/product.service';
import { createCartDto } from './dto/create_cart.dto';
import { to } from '../../common/helper/catchError';
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

        for (let key of keys) {
            let arr = key.split(':');
            let idProduct = arr[1];
            let image = cart[`product:${idProduct}:image`];
            if (key === `product:${idProduct}`) {
                let product = await this.ProductService.getStockById(Number(idProduct));
                if (!product) {
                    await redisClient.hdel(cartId, key);
                    return;
                }

                let cartItem = {
                    ...product,
                    quantity: cart[key],
                    image: image
                }
                cartItems.push(cartItem);
            }
        }

        return cartItems;
    }

    async create(idUser: string, cart: createCartDto) {
        let cartId = `${this.prefixCart}${idUser}`;
        let productKey = `product:${cart.id_product}`;
        let productKeyImg = productKey + ":image"
        let checkProductExist = await this.ProductService.checkStockExist(cart.id_product);
        if (checkProductExist) {
            let prodImage = await redisClient.hset(cartId, productKeyImg, cart.image || null)
            let prodQuantity = await redisClient.hincrby(cartId, productKey, cart.quantity);
            if (Number(prodQuantity) <= 0) {
                await redisClient.hdel(cartId, productKey);
                await redisClient.hdel(cartId, productKeyImg)
            }
            let productInCart = await redisClient.hget(cartId, productKey);
            let imgProd = await redisClient.hget(cartId, productKeyImg);

            return {
                product: cart.id_product,
                quantity: productInCart,
                image: imgProd
            }
        }
    }

    async destroy(idUser: number, idProduct: number) {
        let cartId = `${this.prefixCart}${idUser}`;
        let productKey = `product:${idProduct}`;
        let [err, result] = await to(redisClient.hdel(cartId, productKey));
        if (err) {
            throw new HttpException(err, 500);
        }
        return result
    }
}
