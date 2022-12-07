import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
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

    async verifyPassword(password, hash) {
        let compare = await bcrypt.compare(password, hash);
        if (compare) {
            return true;
        }
        throw new HttpException("wrong password", HttpStatus.FORBIDDEN)
    }
    async SigIn(data: AuthDTO) {
        let user = await this.InternalAccountService.checkAccountExist(data.username);
        let verifyPass = await this.verifyPassword(data.password, user.password);
        // console.log(user);

        if (verifyPass) {
            let profile = await this.UserService.findOne(user.id_profile);
            let tokens = await this.getTokens({ id: user.id, roles: profile.roles });
            await this.updateRefreshToken(tokens.refreshToken, user.id)
            return tokens
        }
    }

    async getTokens(payload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.JwtService.signAsync(payload, {
                secret: this.ConfigService.get<string>("JWT_ACCESS_SECRET"),
                expiresIn: this.ConfigService.get<string>("ACCESS_TOKEN_EXPIRATE") || '40m'
            }),
            this.JwtService.signAsync(payload, {
                secret: this.ConfigService.get<string>("JWT_REFRESH_SECRET"),
                expiresIn: this.ConfigService.get<string>("REFRESH_TOKEN_EXPIRATE") || '7d'
            })
        ]);

        return {
            accessToken, refreshToken
        }
    }

    async updateRefreshToken(refreshToken: string, id: number) {
        let result = await this.InternalAccountService.update(id, { refresh_token: refreshToken })
        console.log(result);

    }
}
