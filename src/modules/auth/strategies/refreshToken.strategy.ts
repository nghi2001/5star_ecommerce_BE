import { Injectable } from "@nestjs/common/decorators";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { PassportStrategy } from "@nestjs/passport/dist/passport/passport.strategy";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwtrefresh'){

    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true
        })
    }
    
    validate(req: Request, payload: any) {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        return { ...payload, refreshToken };
    }
}