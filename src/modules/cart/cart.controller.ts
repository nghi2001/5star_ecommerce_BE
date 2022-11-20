import { Controller, Get, Param, Req, UseGuards, Request, Post, Body, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
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
}
