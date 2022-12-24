import { Controller, Get, Param, Req, UseGuards, Request, Post, Body, ValidationPipe, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import redis from '../../config/database/redis';
import redisClient from '../../config/database/redis';
import { CartService } from './cart.service';
import { createCartDto } from './dto/create_cart.dto';
@Controller('cart')
export class CartController {
    constructor(
        private CartService: CartService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Get("")
    async shows(@Req() req) {
        let userId = req.user.id;
        let carts = await this.CartService.getCartBy(userId);
        return carts
    }

    @UseGuards(JwtAuthGuard)
    @Post("")
    async store(
        @Req() req,
        @Body(new ValidationPipe()) body: createCartDto
    ) {
        let userId = req.user.id;
        let cart = body;
        let newCart = await this.CartService.create(userId, cart);
        return newCart;
    }
    @UseGuards(JwtAuthGuard)
    @Delete("/clear-cart")
    async clearCart(@Req() req) {
        let userId = req.user.id;
        let result = await this.CartService.clearCart(userId);
        return result;
    }
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async destroy(
        @Req() req,
        @Param("id") id: number) {
        let idUser = req?.user?.id;
        let result = await this.CartService.destroy(idUser, id);
        return result;
    }
}
