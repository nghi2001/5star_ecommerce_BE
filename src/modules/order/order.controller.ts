import { Body, CacheInterceptor, Controller, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { UserService } from '../user/user.service';
import { UpdateStatusDTO } from './dto/update-status.dto';
import { PaymentResultDTO } from './dto/payment-update.dto';

@Controller('order')
@UseInterceptors(CacheInterceptor)
export class OrderController {
    constructor(
        private OrderService: OrderService,
        private UserService: UserService
    ) { }

    @Get()
    async shows() {

    }
    @Get("/return")
    async Test(
        @Query() query
    ) {
        return query;
    }

    @Put("/payment-success")
    async paymentSuccess(@Body(new ValidationPipe()) body: PaymentResultDTO) {
        console.log(body);
        return body
    }

    @Get("/:id/order-payment-vnpay/")
    async paymentVNPAY(
        @Param("id") id: number,
        @Req() req
    ) {
        let link = await this.OrderService.getLinkPaymentVNPAY(id, req)
        return link;
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
        return data
    }

    @UseGuards(JwtAuthGuard)
    @Put(":id")
    async update(
        @Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdateStatusDTO
    ) {
        let updateResult = await this.OrderService.update(id, body);
        let data = await this.OrderService.find(id);
        return data;
    }
}
