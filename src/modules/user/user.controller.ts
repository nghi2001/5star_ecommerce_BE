import { Controller, Param, Put, Query, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Post, Body, Delete } from '@nestjs/common';
import { ValidationPipe } from 'src/common/pipe/validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDTO } from './dto/update-user.dto';
@Controller('user')
export class UserController {
    constructor(
        private UserService: UserService
    ) { }



    @Get(":id")
    async find(@Param("id") id) {
        if (this.UserService.checkObjectId(id)) {
            let user = await this.UserService.findOne(id);
            return user;
        }

    }
    @Get("/")
    async show() {
        let [profiles, count] = await this.UserService.getAllUser();
        return { profiles, count };

    }
    @Post("/")
    async create(
        @Body(new ValidationPipe()) createUserDto: CreateUserDto
    ) {
        try {
            let result = await this.UserService.createUser(createUserDto);

            return result;
        } catch (error) {
            return [error];
        }
    }

    @Delete("/:id")
    async delete(@Param("id") id) {
        if (this.UserService.checkObjectId(id)) {

            let result = await this.UserService.deleteUser(id);

            return result;
        }
    }

    @Put("/:id")
    async update(@Param("id") id,
    @Body(new ValidationPipe()) body: updateUserDTO
    ) {
        if (this.UserService.checkObjectId(id)) {

            let result = await this.UserService.update(id, body);
            
            return result;
        }
    }
}
