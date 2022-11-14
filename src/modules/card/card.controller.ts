import { Controller, Get } from '@nestjs/common';
import redisClient from '../../config/database/redis';
@Controller('card')
export class CardController {
    constructor() {
    }

    @Get("")
    async shows() {
        // await this.cacheManager.get('name')
        redisClient.HSET('card:user:1', "stockid", "1");
        return redisClient.HGETALL("card:user:1")
    }
}
