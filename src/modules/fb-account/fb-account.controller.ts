import { Body, Controller, HttpException, Post, Res, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { to } from 'src/common/helper/catchError';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { CreateFbAccountDTO } from './dto/create-account.dto';
import { FbAccountService } from './fb-account.service';

@Controller('fb-account')
export class FbAccountController {
    constructor(
        private fbAccountService: FbAccountService,
        private UserService: UserService,
        private AuthService: AuthService,
        private ConfigService: ConfigService
    ) { }

    @Post("/login")
    async login(
        @Res() res,
        @Body(new ValidationPipe()) body: CreateFbAccountDTO) {
        let [err, userInfo] = await to(this.fbAccountService.verifyFbToken(body.token));
        if (err) {
            console.log("Err Create Facebook Account", err.message);
            throw new HttpException("Can't create facebook account", 500)
        }
        let checkData = await this.fbAccountService.getByUid(userInfo.id);
        if (!checkData) {
            let account = await this.fbAccountService.createAccount(userInfo.id, userInfo.name)
            let profile = await this.UserService.findOne(account.id_profile);
            let tokens = await this.AuthService.getTokens({ id: profile.id, roles: profile.roles, name: profile.first_name }, 1)
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 10,
                domain: this.ConfigService.get<string>("FRONTEND_DOMAIN")
            });
            res.json({
                statusCode: 200,
                data: {
                    accessToken: tokens.accessToken,
                    user_info: profile
                }
            })
        } else {
            let profile = await this.UserService.findOne(checkData.id_profile);
            let tokens = await this.AuthService.getTokens({ id: profile.id, roles: profile.roles, name: profile.first_name })
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 10,
                domain: this.ConfigService.get<string>("FRONTEND_DOMAIN")
            });
            res.json({
                statusCode: 200,
                data: {
                    accessToken: tokens.accessToken,
                    user_info: profile
                }
            })
        }

    }
}
