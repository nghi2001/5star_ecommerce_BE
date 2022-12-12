import { Body, CacheInterceptor, Controller, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { UserService } from '../user/user.service';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { UpdateStatusDTO } from './dto/update-status.dto';

@Controller('order')
@UseInterceptors(CacheInterceptor)
export class OrderController {
    constructor(
        private OrderService: OrderService,
        private UserService: UserService,
        private ConfigService: ConfigService
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
    @Get("/:id/order-payment-vnpay/")
    async paymentVNPAY(@Param("id") id: number) {
        let order = await this.OrderService.find(id);
        console.log(order);
        let now: Date | string = new Date();
        let refCode = moment(now).format('ymdHms');
        now = moment(now).format("YYYYMMDDHHmmss")

        console.log(refCode, now);
        let vnp_Params = {};
        vnp_Params['vnp_Amount'] = 100000 * 100;
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_CreateDate'] = now;
        vnp_Params['vnp_CurrCode'] = "VND";
        vnp_Params['vnp_IpAddr'] = '127.0.0.1';
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_OrderInfo'] = 'vnp_OrderInfo=Thanh+toan+don+hang';
        vnp_Params['vnp_OrderType'] = "topup"
        vnp_Params['vnp_ReturnUrl'] = this.ConfigService.get<string>("RETURN_URL");
        vnp_Params['vnp_TmnCode'] = this.ConfigService.get<string>("VNP_TMNCODE")
        vnp_Params['vnp_TxnRef'] = moment(new Date()).format('HHmmss');
        vnp_Params['vnp_Version'] = '2.1.0';
        let secretKey = this.ConfigService.get<string>("VNP_SECRET");
        let link = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?`;
        vnp_Params = this.OrderService.sortObject(vnp_Params);
        let signData = null
        let querystring = require('qs');
        signData = querystring.stringify(vnp_Params, {
            encode: false
        });
        console.log(signData);

        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        console.log(signed);
        vnp_Params['vnp_SecureHash'] = signed
        signData =
            signData = querystring.stringify(vnp_Params, {
                encode: false
            });
        console.log(vnp_Params);
        link += signData;
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

    @Put(":id/state")
    async update(@Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdateStatusDTO
    ) {
        let updateResult = await this.OrderService.updateStatusOrder(id, body.status);
        let data = await this.OrderService.find(id);
        return data;
    }
}
