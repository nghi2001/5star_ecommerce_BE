import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import redisClient from '../../config/database/redis';

@Injectable()
export class CardService {
    prefixCard: string;
    constructor(
        private configService: ConfigService
    ) {
        this.prefixCard = this.configService.get("PREFIX_CARD");
    }

    async getCardBy(idUser: number) {
        let card = await redisClient.HGETALL(this.prefixCard + idUser);
        return card
    }

    async create(idUser: string, card: any) {
        let newCard = await redisClient.HSET(this.prefixCard + idUser, Object.entries(card));
        return newCard
    }
}
