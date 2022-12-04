import { Body, Controller, Delete, Get, HttpException, Param, Req, Post, ValidationPipe } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { GetResetPasswordTokenDTO } from './dto/forgot-password.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { InternalaccountService } from './internalaccount.service';
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDTO } from './dto/reset-password';
@Controller('internalaccount')
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
            return result;
        }
        return new HttpException("Can't create account", 500);
    }

    @Post("/update-password")
    async updatePassword(@Body(new ValidationPipe()) body: UpdatePasswordDTO) {
        let result = await this.AccountService.updatePass(body);
        return true;
    }

    @Post("/forgot-password")
    async forgotPassword(@Body(new ValidationPipe()) body: GetResetPasswordTokenDTO) {
        let user = await this.AccountService.getUserInfo(body.email);
        console.log(user);

        let token = await this.AccountService.generateResetPassToken({
            id: user.id,
            first_name: user.profile.first_name,
            last_name: user.profile.last_name
        });
        let link = this.ConfigService.get("FE_RESET_PASS_URL") + "?token=" + token;
        console.log(link);

        this.mailQueue.add({
            to: body.email,
            html: `
                <p>Truy cập đến link này để cập nhật password mới: ${link} </p>
            `
        })
        return true;
    }

    @Post("/reset-password")
    async resetPassword(
        @Body(new ValidationPipe()) body: ResetPasswordDTO
    ) {
        let verifyToken = await this.AccountService.verifyToken(body.token);
        let id = verifyToken.id;
        let checkConfirmPass = this.AccountService.checkConfirmPass(body.newPass, body.confirmPass);
        if (!checkConfirmPass) {
            // throw new HttpException("")
        }
        return;

    }

    @Delete("/:id")
    async destroy(@Param("id") id) {
        let result = await this.AccountService.destroy(id);
        return result
    }

}
