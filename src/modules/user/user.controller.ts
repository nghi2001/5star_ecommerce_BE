import { Controller, Param, Query, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Post, Body, Delete } from '@nestjs/common';
import { ValidationPipe } from 'src/common/pipe/validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
@Controller('user')
export class UserController {
    constructor(
        private UserService: UserService
    ) { }
    

    
    @Get(":id")
    async find(@Param("id") id) {
        try {
            if (this.UserService.checkObjectId(id)) {
                let { account, ...user } = await this.UserService.findOne(id);
                return [user]
            }
        } catch (error) {
            return error
        }
    }
    @Get("/")
    async show() {
        try {
            let users = await this.UserService.getAllUser();
            return [users]
        } catch (error) {
            return error
        }
        // res.json('ajd')
        // return 'ajlvjladbv'
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
            if (this.UserService.checkObjectId(id)) {

                let result = await this.UserService.deleteUser(id)

                return result
            }
        } catch (error) {
            return error
        }
    }
}
