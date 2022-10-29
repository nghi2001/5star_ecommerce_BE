import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    constructor(
        private UserService: UserService,
        private JwtService: JwtService,
        private ConfigService: ConfigService
    ) {
    }

    async verifyPassword (password, hash ) {
        let compare = await bcrypt.compare(password, hash);
        if( compare ) {
            return true;
        }
        throw new HttpException("wrong password", HttpStatus.FORBIDDEN)
    }
    async SigIn(data: AuthDTO) {
        let user: any = await this.UserService.checkUserExist(data.username);
        let verifyPass = await this.verifyPassword(data.password, user.account.password);
        if(verifyPass) {
            let tokens = await this.getTokens({id:user._id});
            await this.updateRefreshToken(tokens.refreshToken, user._id)
            return tokens
        }
    }

    async getTokens(payload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.JwtService.signAsync(payload, {
                secret: this.ConfigService.get<string>("JWT_ACCESS_SECRET"),
                expiresIn: '30m'
            }),
            this.JwtService.signAsync(payload,{
                secret: this.ConfigService.get<string>("JWT_REFRESH_SECRET"),
                expiresIn: "7d"
            })
        ]);

        return {
            accessToken, refreshToken
        }
    }

    async updateRefreshToken(refreshToken: string, id: string) {
        await this.UserService.update(id, {refreshToken})
    }
}
