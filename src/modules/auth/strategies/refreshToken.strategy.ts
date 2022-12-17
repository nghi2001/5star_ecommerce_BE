import { Injectable } from "@nestjs/common/decorators";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { PassportStrategy } from "@nestjs/passport/dist/passport/passport.strategy";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwtrefresh') {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    let data = request?.cookies["refreshToken"];

                    return data
                }
            ]),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true
        })
    }

    validate(req: Request, payload: any) {
        const refreshToken = req?.cookies['refreshToken'];
        return { ...payload, refreshToken };
    }
}