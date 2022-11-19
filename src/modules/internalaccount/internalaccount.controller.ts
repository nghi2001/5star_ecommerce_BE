import { Body, Controller, Delete, Get, HttpException, Param, Post, ValidationPipe } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { InternalaccountService } from './internalaccount.service';

@Controller('internalaccount')
export class InternalaccountController {
    constructor(
        private AccountService: InternalaccountService
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

    @Delete("/:id")
    async destroy(@Param("id") id) {
        let result = await this.AccountService.destroy(id);
        return result
    }

}
