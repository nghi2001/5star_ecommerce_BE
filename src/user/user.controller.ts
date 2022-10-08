import { Controller, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Post, Body, Delete } from '@nestjs/common';
import { ValidationPipe } from 'src/common/pipe/validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
@Controller('user')
export class UserController {
    constructor(
        private UserService: UserService
    ) { }

    // @Get("/test")
    // async create() {
    //     let result = await this.UserService.createUser()
    //     return result
    // }
    @Get("/:id")
    async find(@Param("id") id) {
        try {
            if(this.UserService.checkObjectId(id)) {
                let {account, ...user} = await this.UserService.findOne(id);
                return [user]
            }
        } catch (error) {
            return error
        }
    }

    @Post("/")
    async create(
        @Body(new ValidationPipe()) createUserDto: CreateUserDto
    ) {
        try {
            let result = await this.UserService.createUser(createUserDto);
            return [result]
        } catch (error) {
            return [error]
        }
    }

    @Delete("/:id")
    async delete(@Param("id") id) {
        try {
            if (this.UserService.checkObjectId(id)){
                
                let result = await this.UserService.deleteUser(id)

                return result
            }
        } catch (error) {
            return error
        }
    }
}
