import {
    Controller, Get,
    Post, Body, Request, UseGuards, HttpException, HttpStatus,UseInterceptors
} from '@nestjs/common';
import { ValidationPipe } from 'src/common/pipe/validation.pipe';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { RefreshTokenAuthGuard } from 'src/guards/refresh-token-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private AuthService: AuthService,
        private UserService: UserService
    ) { }

    @Post("login")
    async login(@Body(new ValidationPipe()) AuthDTO: AuthDTO) {
        let tokens = await this.AuthService.SigIn(AuthDTO);
        return tokens
    }

    @UseGuards(RefreshTokenAuthGuard)
    @Post("resettoken")
    async resetToken(@Request() req) {
        let id = req.user.id;
        let user = await this.UserService.findOne(id);
        if (user.refreshToken !== req.user.refreshToken) {
            throw new HttpException("token not valid", HttpStatus.NOT_FOUND);
        }
        let token = await this.AuthService.getTokens({ id: id });
        await this.AuthService.updateRefreshToken(token.refreshToken, id);

        return token
    }

    @UseGuards(JwtAuthGuard)
    @Post("logout")
    async logout(@Request() req) {
        await this.AuthService.updateRefreshToken(null, req.user.id);
        return true
    }

    @UseGuards(RefreshTokenAuthGuard)
    @Get("/a")
    async test(@Request() req) {
        console.log(req.user);

        return 'nghi'
    }
}
