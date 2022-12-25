import { Body, CacheInterceptor, Controller, Get, HttpException, Param, Post, Put, Query, Req, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { UserService } from '../user/user.service';
import { UpdateStatusDTO } from './dto/update-status.dto';
import { PaymentResultDTO } from './dto/payment-update.dto';
import { ORDER_STATUS, Role } from 'src/common/enum';
import { to } from 'src/common/helper/catchError';
import { pager } from 'src/common/helper/paging';
import { ProductService } from '../product/product.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('order')
@UseInterceptors(CacheInterceptor)
export class OrderController {
    constructor(
        private OrderService: OrderService,
        private UserService: UserService,
        private ProductService: ProductService
    ) { }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Get("/count-statistic")
    async countStatistic(@Query() query) {
        let condition = await this.OrderService.renderCondition(query);
        let data = await this.OrderService.countStatistic(condition);
        return data
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Get("/count")
    async count() {
        let [err, count] = await to(this.OrderService.count());
        if (err) {
            console.log("err count order", err);
            return {
                total: 0
            }
        }
        return {
            total: count
        }
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Get("/sum")
    async sumOrder(@Query() query) {
        let condition = await this.OrderService.renderCondition(query);
        let sum = await this.OrderService.sumOrder(condition);
        if (!sum.sum) sum.sum = 0
        return sum
    }
    @Get()
    async shows(@Query() query) {
        let pagination = pager(query);
        let condition = await this.OrderService.renderCondition(query);
        let data = await this.OrderService.getList(condition, pagination);
        return data;
    }

    @Get("/return")
    async Test(
        @Query() query
    ) {
        return query;
    }

    @Put("/payment-success")
    async paymentSuccess(@Body(new ValidationPipe()) body: PaymentResultDTO) {
        if (!body.payment_code || body.payment_code == 'null') {
            throw new HttpException("payment code not valid", 400);
        }
        let orders = await this.OrderService.getList({ payment_code: body.payment_code });
        if (orders.data.length <= 0) {
            throw new HttpException("Order not found", 404);
        }

        let [err, updateResult] = await to(this.OrderService.update(orders.data[0].id, {
            status: ORDER_STATUS.NO_PROCESS,
            payment_code: 'null'
        }))

        if (err) {
            throw new HttpException("Error update order status", 500);
        }
        let order = await this.OrderService.find(orders.data[0].id);
        for (let i of order.details) {
            let productStock = await this.ProductService.getStockById(i.product_id);
            let product = await this.ProductService.getOneProduct(productStock.product.id);
            product.sold += i.quantity;
            await product.save();
        }

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


    // @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body(new ValidationPipe()) body: CreateOrderDto,
        @Req() req
    ) {
        try {

            let id = 7;

            let user = await this.UserService.findOne(id);
            let data = await this.OrderService.create(body, user);
            return data
        } catch (error) {
            console.log(error);
            return false
        }
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
