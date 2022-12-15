import { Controller, Get, Post, Body, UseGuards, HttpException, HttpStatus, Res, Req, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { RefreshTokenAuthGuard } from '../../guards/refresh-token-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { InternalaccountService } from '../internalaccount/internalaccount.service';
import { ConfigService } from '@nestjs/config';
import { RevokeDeviceDTO } from './dto/revoke-device';

@Controller('auth')
@UseInterceptors(CacheInterceptor)
export class AuthController {
    constructor(
        private AuthService: AuthService,
        private InternalAccountService: InternalaccountService,
        private ConfigService: ConfigService
    ) { }

    @Post("login")
    async login(
        @Body(new ValidationPipe()) AuthDTO: AuthDTO,
        @Res() res: Response,
        @Req() req
    ) {
        let { device_info, hashAndIp } = this.AuthService.getDeviceInfo(req);

        let tokens = await this.AuthService.SigIn(AuthDTO, device_info, hashAndIp);
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 10,
            domain: this.ConfigService.get<string>("FRONTEND_DOMAIN")
        });
        let user = await this.InternalAccountService.getUserInfo(AuthDTO.username);

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
        let { device_info, hashAndIp } = this.AuthService.getDeviceInfo(req);
        let user = await this.InternalAccountService.findOne(id);

        if (!user.refresh_token[hashAndIp]) {
            throw new HttpException("Forbiden", HttpStatus.FORBIDDEN);
        }
        if (user.refresh_token[hashAndIp].refreshToken !== req.user.refreshToken) {
            throw new HttpException("token not valid", HttpStatus.NOT_FOUND);
        }

        let token = await this.AuthService.getTokens({ id: id, roles: roles });

        await this.AuthService.updateRefreshToken(token.refreshToken, id, hashAndIp, device_info);

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
        let id = req.user.id;
        let { hashAndIp } = this.AuthService.getDeviceInfo(req);
        await this.AuthService.revokeRefreshToken(id, hashAndIp);
        res.clearCookie("refreshToken");
        res.json(true);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/list-device")
    async getListDevice(@Req() req) {
        let data = await this.InternalAccountService.getListDevice(req.user.id);

        return data
    }

    @UseGuards(JwtAuthGuard)
    @Post("/revoke-device")
    async revoleDevice(
        @Req() req,
        @Body(new ValidationPipe()) body: RevokeDeviceDTO) {
        let id = req.user.id;
        let hash = body.hash;
        let result = await this.AuthService.revokeRefreshToken(id, hash);
        return result;
    }
}
