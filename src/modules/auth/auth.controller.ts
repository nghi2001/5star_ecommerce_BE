import { Controller, Get, Post, Body, UseGuards, HttpException, HttpStatus, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { RefreshTokenAuthGuard } from '../../guards/refresh-token-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { InternalaccountService } from '../internalaccount/internalaccount.service';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';

@Controller('auth')
export class AuthController {
    constructor(
        private AuthService: AuthService,
        private UserService: UserService,
        private InternalAccountService: InternalaccountService,
        private ConfigService: ConfigService
    ) { }

    @Post("login")
    async login(
        @Body(new ValidationPipe()) AuthDTO: AuthDTO,
        @Res() res: Response,
        @Req() req: Request
    ) {
        // let domain = req.headers.origin.split(":")[1];
        // domain = domain.replace(/[^a-zA-Z ]/g, "")
        // console.log(domain);

        let tokens = await this.AuthService.SigIn(AuthDTO);
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 10
        });
        let user = await this.InternalAccountService.getUserInfo(AuthDTO.username);
        // console.log(user);

        res.json({
            statusCode: 200,
            data: {
                accessToken: tokens.accessToken,
                user_info: user
            }
        })
    }

    @UseGuards(RefreshTokenAuthGuard)
    @Post("resettoken")
    async resetToken(@Req() req, @Res() res: Response) {
        let id = req.user.id;
        let roles = req.user.roles;
        console.log(req.user.roles);

        let user = await this.InternalAccountService.findOne(id);
        console.log(req.user);

        if (user.refresh_token !== req.user.refreshToken) {
            throw new HttpException("token not valid", HttpStatus.NOT_FOUND);
        }

        let token = await this.AuthService.getTokens({ id: id, roles: roles });
        await this.AuthService.updateRefreshToken(token.refreshToken, id);

        res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            domain: this.ConfigService.get<string>('FRONTEND_DOMAIN')
        })
        res.json({
            statusCode: 200,
            data: {
                accessToken: token.accessToken
            }
        })
    }

    @UseGuards(JwtAuthGuard)
    @Post("logout")
    async logout(@Req() req, @Res() res: Response) {
        await this.AuthService.updateRefreshToken(null, req.user.id);
        res.clearCookie("refreshToken");
        res.json(true);
    }

    @UseGuards(RefreshTokenAuthGuard)
    @Get("/a")
    async test(@Req() req) {
        console.log(req.user);

        return 'nghi'
    }
}
