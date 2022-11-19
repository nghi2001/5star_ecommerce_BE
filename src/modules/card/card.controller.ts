import { Controller, Get, Param, Req, UseGuards, Request, Post, Body, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import redisClient from '../../config/database/redis';
import { CardService } from './card.service';
import { createCardDto } from './dto/create_card.dto';
@Controller('card')
export class CardController {
    constructor(
        private CardService: CardService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Get("")
    async shows(@Req() req) {
        let userId = req.user.id;
        let cards = await this.CardService.getCardBy(userId);
        return cards
    }

    @UseGuards(JwtAuthGuard)
    @Post("")
    async store(
        @Req() req,
        @Body(new ValidationPipe()) body: createCardDto
    ) {
        let userId = req.user.id;
        let card = body;

        let checkCard = await this.CardService.getCardBy(userId);
        if (Object.keys(checkCard).length) {
            let newCard = await this.CardService.create(userId, card);
            return newCard
        }
    }
}
