import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InternalaccountService } from '../internalaccount/internalaccount.service';
@Injectable()
export class AuthService {
    constructor(
        private UserService: UserService,
        private InternalAccountService: InternalaccountService,
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
        let user: any = await this.InternalAccountService.checkAccountExist(data.username);
        let verifyPass = await this.verifyPassword(data.password, user.password);
        if(verifyPass) {
            let tokens = await this.getTokens({id:user.id});
            await this.updateRefreshToken(tokens.refreshToken, user.id)
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

    async updateRefreshToken(refreshToken: string, id: number) {
        let result = await this.InternalAccountService.update(id, {refresh_token: refreshToken})
        console.log(result);
        
    }
}
