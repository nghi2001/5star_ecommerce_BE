import { Injectable, NestMiddleware } from '@nestjs/common';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpMiddleware implements NestMiddleware {
    async use(req, res: Response, next: NextFunction) {
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        let info = await axios.get(`http://ip-api.com/json/${ip}`);
        let ipData = info.data;
        let address = 'localhost';
        console.log(info.data, ip);

        if (ipData.status == 'success') {
            address = `
            <p>Địa điểm: ${ipData.city} - ${ipData.country}</p>
            <p>zip code: ${ipData.zip}</p>
            <p>timezone: ${ipData.timezone}</p>
            `
        }
        req.ipInfo = address
        next();
    }
}
