import { CacheInterceptor, Controller, HttpException, HttpStatus, Param, Put, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Post, Body, Delete } from '@nestjs/common';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum';
import { changeRoleDTO } from './dto/change-role.dto';
import { pager } from 'src/common/helper/paging';

@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UserController {
    constructor(
        private UserService: UserService
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Put("/role/:id")
    async changeRole(
        @Body(new ValidationPipe()) body: changeRoleDTO,
        @Param("id") id: number,
        @Req() req
    ) {
        let user = await this.UserService.findOne(id);
        if (!user) {
            throw new HttpException("Id not fount", 404);
        }

        if (body.role.includes(Role.ADMIN)) {
            if (!req.user.roles.includes(Role.SUPER_ADMIN)) {
                throw new HttpException("Forbiden", HttpStatus.FORBIDDEN)
            }
        }
        if (body.role.includes(Role.SUPER_ADMIN)) {
            body.role = body.role.filter(role => role != Role.SUPER_ADMIN)
        }

        user.roles = body.role;
        let updateResult = await this.UserService.update(id, {
            roles: user.roles
        })
        return updateResult

    }

    @Get(":id")
    async find(@Param("id") id) {
        if (this.UserService.checkObjectId(id)) {
            let user = await this.UserService.findOne(id);
            return user;
        }

    }
    @Get("/")
    async show(@Query() query) {
        let pagination = pager(query);
        let condition = await this.UserService.renderCondition(query);
        let data = await this.UserService.getAllUser(condition, pagination);
        return data;

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
            let data = await this.UserService.findOne(id);
            return data
        }
    }
}
