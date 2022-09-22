import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Get } from '@nestjs/common';
@Controller('user')
export class UserController {
    constructor(
        private UserService: UserService
    ){}
    
    @Get()
    async Hello() {
        let helo = await this.UserService.Hello()

        return [helo]
    }

    @Get("/add")
    async Add() {
        let data = await this.UserService.add()
        return [data]
    }
}
