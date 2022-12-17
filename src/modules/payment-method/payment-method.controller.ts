import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { pager } from 'src/common/helper/paging';
import { CreatePaymentMethodDTO } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDTO } from './dto/update-payment-method.dto';
import { PaymentMethodService } from './payment-method.service';

@Controller('payment-method')
export class PaymentMethodController {
    constructor(
        private PaymentMethosService: PaymentMethodService
    ) { }

    @Post()
    async create(
        @Body(new ValidationPipe()) body: CreatePaymentMethodDTO
    ) {
        let data = await this.PaymentMethosService.create(body);
        return data
    }

    @Get("")
    async shows(@Query() query) {
        let pagination = pager(query);
        let condition = await this.PaymentMethosService.renderCondition(query);
        let data = await this.PaymentMethosService.getList(condition, pagination);
        return data;
    }

    @Get(":id")
    async find(@Param("id") id: number) {
        let data = await this.PaymentMethosService.getOne(id);
        if (!data) {
            throw new HttpException("Id not found", 404);
        }
        return data;
    }

    @Delete(":id")
    async destroy(@Param("id") id: number) {
        let data = await this.destroy(id);
        return data;
    }

    @Put(":id")
    async update(
        @Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdatePaymentMethodDTO) {
        let result = await this.PaymentMethosService.update(id, body);
        return result;
    }
}
