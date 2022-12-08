import { Body, Controller, Get, Param, Post, Put, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { UserService } from '../user/user.service'
@Controller('order')
export class OrderController {
    constructor(
        private OrderService: OrderService,
        private UserService: UserService
    ) { }

    @Get()
    async shows() {

    }

    @Get(":id")
    async find(@Param("id") id: number) {

    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body(new ValidationPipe()) body: CreateOrderDto,
        @Req() req
    ) {
        let id = req.user.id;
        let user = await this.UserService.findOne(id);

        let data = await this.OrderService.create(body, user);
    }

    @Put(":id")
    async update(@Param("id") id: number) {

    }
}
