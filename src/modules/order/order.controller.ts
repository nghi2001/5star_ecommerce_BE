import { Body, CacheInterceptor, Controller, Get, HttpException, Param, Post, Put, Query, Req, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { UserService } from '../user/user.service';
import { UpdateStatusDTO } from './dto/update-status.dto';
import { PaymentResultDTO } from './dto/payment-update.dto';
import { ORDER_STATUS } from 'src/common/enum';
import { to } from 'src/common/helper/catchError';
import { pager } from 'src/common/helper/paging';

@Controller('order')
@UseInterceptors(CacheInterceptor)
export class OrderController {
    constructor(
        private OrderService: OrderService,
        private UserService: UserService
    ) { }

    @Get()
    async shows(@Query() query) {
        let pagination = pager(query);
        let condition = await this.OrderService.renderCondition(query);
        let data = await this.OrderService.getList();
    }
    @Get("/return")
    async Test(
        @Query() query
    ) {
        return query;
    }

    @Put("/payment-success")
    async paymentSuccess(@Body(new ValidationPipe()) body: PaymentResultDTO) {
        let orders = await this.OrderService.getList({ payment_code: body.payment_code });
        if (orders.length <= 0) {
            throw new HttpException("Order not found", 404);
        }
        let [err, updateResult] = await to(this.OrderService.update(orders[0].id, {
            status: ORDER_STATUS.PAID,
            payment_code: 'null'
        }))
        console.log(updateResult);

        if (err) {
            throw new HttpException("Error update order status", 500);
        }
        let order = await this.OrderService.find(orders[0].id);
        return order
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
        let data = await this.OrderService.find(id);
        return data;
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
