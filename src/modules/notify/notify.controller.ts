import { Body, Controller, Get, HttpException, Param, Post, Put, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum';
import { to } from 'src/common/helper/catchError';
import { pager } from 'src/common/helper/paging';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreaeteNotifyDTO } from './dto/create-notify.dto';
import { UpdateNotifyDTO } from './dto/update-notify.dto';
import { NotifyService } from './notify.service';

@Controller('notify')
export class NotifyController {

    constructor(
        private NotifyService: NotifyService
    ) { }

    @Post()
    async create(@Body(new ValidationPipe()) body: CreaeteNotifyDTO) {
        let data = await this.NotifyService.create(body);
        return data
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    async shows(@Query() query) {
        let pagination = pager(query);
        let condition = await this.NotifyService.renderCondition(query);
        let data = await this.NotifyService.getList(condition, pagination);
        return data;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    @Get("/user")
    async getByUser(@Query() query, @Req() req) {
        let pagination = pager(query);
        console.log(req.user, '-------NGHI');

        let userId = req.user.id;
        let data = await this.NotifyService.getByUserId(userId, pagination);
        return data;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Put(":id")
    async update(@Param("id") id: number, @Body(new ValidationPipe()) body: UpdateNotifyDTO) {
        let [err] = await to(this.NotifyService.update(id, body));
        if (err) {
            console.log("Update Notify", err);
            throw new HttpException("Error update", 500)
        }
        let data = await this.NotifyService.getOne(id);
        return data
    }
}
