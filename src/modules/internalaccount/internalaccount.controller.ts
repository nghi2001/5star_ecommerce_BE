import { Body, Controller, Delete, Get, HttpException, Param, Req, Post, ValidationPipe, CacheInterceptor, UseInterceptors } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { GetResetPasswordTokenDTO } from './dto/forgot-password.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { InternalaccountService } from './internalaccount.service';
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDTO } from './dto/reset-password';
import { generatePassword } from 'src/common/helper/generate-password';
import * as moment from 'moment';
import { ActiveAccountDTO } from './dto/active-account';
import { GetActiveAccountDTO } from './dto/get-active-account';
import { Throttle } from '@nestjs/throttler';

@Controller('internalaccount')
@UseInterceptors(CacheInterceptor)
export class InternalaccountController {
    constructor(
        private AccountService: InternalaccountService,
        @InjectQueue('mail') private mailQueue: Queue,
        private ConfigService: ConfigService
    ) { }

    @Get()
    async shows() {
        let result = await this.AccountService.show();
        return result;
    }

    @Post()
    async create(
        @Body(new ValidationPipe()) body: CreateAccountDto
    ) {
        let result = await this.AccountService.create(body);
        if (result) {
            let code = generatePassword(30);
            let account = await this.AccountService.findByUserName(body.email);
            let now = new Date();
            let timeExpirate = moment(now).add(8, 'm').toDate();
            this.AccountService.updateCode(account.id, {
                code,
                timeExpirate
            });
            this.mailQueue.add({
                to: body.email,
                subject: "Mã kích hoạt tài khoản",
                html: `
                    <p>Đây là mã kích hoạt tài khoản của bạn: ${code} </p>
                `
            })
            setTimeout(async () => {
                await this.AccountService.destroyAccountInactive(account.id)
            }, 1000 * 60 * 10)
            return result;
        }
        return new HttpException("Can't create account", 500);
    }

    @Post("/get-active")
    async getNewActiveCode(
        @Body(new ValidationPipe()) body: GetActiveAccountDTO
    ) {
        let code = generatePassword(30);
        let account = await this.AccountService.findByUserName(body.email);
        let now = new Date();
        let timeExpirate = moment(now).add(8, 'm').toDate();
        this.AccountService.updateCode(account.id, {
            code,
            timeExpirate
        });
        this.mailQueue.add({
            to: body.email,
            html: `
                    <p>Đây là mã kích hoạt tài khoản của bạn: ${code} </p>
                `
        })
        return true;
    }

    @Throttle(10, 60)
    @Post("/active")
    async activeAccount(@Body(new ValidationPipe()) body: ActiveAccountDTO) {
        let user = await this.AccountService.findByUserName(body.email);
        let now = new Date();
        if (!user) {
            throw new HttpException("email not exist", 404);
        }
        let checkCode = user.code[body.code];
        if (!checkCode) {
            throw new HttpException("wrong code", 400);
        }

        let checkExpirateCode = moment(new Date(checkCode)).isAfter(now);
        if (!checkExpirateCode) {
            await this.AccountService.removeCode(user.id, body.code);
            throw new HttpException("code expirate", 400);
        }
        let activeResult = await this.AccountService.activeAccount(user.id);
        if (activeResult) {
            await this.AccountService.removeCode(user.id, body.code);
        }
        return activeResult;
    }

    @Post("/update-password")
    async updatePassword(@Body(new ValidationPipe()) body: UpdatePasswordDTO) {
        let result = await this.AccountService.updatePass(body);
        return true;
    }

    @Post("/forgot-password")
    async forgotPassword(@Body(new ValidationPipe()) body: GetResetPasswordTokenDTO) {
        let user = await this.AccountService.getUserInfo(body.email);
        if (!user) {
            throw new HttpException("email not found", 404);
        }
        let code = generatePassword(40);

        this.mailQueue.add({
            to: body.email,
            subject: "Quên mật khẩu",
            html: `
                <p>Đây là mã kích quên mật khẩu của bạn: ${code} </p>
            `
        })
        let now = new Date();
        let timeExpirate = moment(now).add(8, 'm').toDate();
        this.AccountService.updateCode(user.id, {
            code,
            timeExpirate
        })
        return true;
    }

    @Post("/reset-password")
    async resetPassword(
        @Body(new ValidationPipe()) body: ResetPasswordDTO
    ) {
        let user = await this.AccountService.findByUserName(body.email);
        let now = new Date();
        if (!user) {
            throw new HttpException("email not found", 404);
        }

        let checkCode = user.code[body.code];
        if (!user.code[body.code]) {
            throw new HttpException("wrong code", 400);
        }
        let checkExpirateCode = moment(new Date(checkCode)).isAfter(now);

        if (!checkExpirateCode) {
            await this.AccountService.removeCode(user.id, body.code);
            throw new HttpException("code expirate", 400);
        }
        let updateResult = await this.AccountService.resetPass(body);

        if (updateResult) {
            await this.AccountService.removeCode(user.id, body.code);
        }
        return true;

    }

    @Delete("/:id")
    async destroy(@Param("id") id) {
        let result = await this.AccountService.destroy(id);
        return result
    }

}
