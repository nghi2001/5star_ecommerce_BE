import { HttpException, Injectable } from '@nestjs/common';
import { to } from 'src/common/helper/catchError';
import { CreatePaymentMethodDTO } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDTO } from './dto/update-payment-method.dto';
import { PaymentMethodRepository } from './payment-method.repository';

@Injectable()
export class PaymentMethodService {
    constructor(
        private PaymentMethodRepository: PaymentMethodRepository
    ) { }

    async renderCondition(query) {
        let {
            name,
            status
        } = query;
        let condition: any = {};
        if (name) {
            condition.name = name;
        }
        if (status) {
            condition.status = status;
        }
        return condition
    }

    async create(dataInsert: CreatePaymentMethodDTO) {
        let [err, data] = await to(this.PaymentMethodRepository.createPaymentMethod(dataInsert));
        if (err) {
            console.log("Create Payment Method: ", err);
            throw new HttpException("Create Payment Method", 500);
        }
        return data;
    }

    async getOne(id: number) {
        let data = await this.PaymentMethodRepository.findOneBy({ id });
        return data || null;
    }

    async getList(filter = {}, pagination = {}) {
        let data = await this.PaymentMethodRepository.getList(filter, pagination);
        return data;
    }

    async destroy(id: number) {
        let [err, result] = await to(this.PaymentMethodRepository.delete({ id }));
        if (err) {
            throw new HttpException("Delete Payment Method", 500);
        }
        return result;
    }

    async update(id, data: UpdatePaymentMethodDTO) {
        let dataUpdate: UpdatePaymentMethodDTO = {};
        let paymentMethod = await this.getOne(id);
        if (!paymentMethod) {
            throw new HttpException("Id not found", 404);
        }
        if (data.name && data.name != paymentMethod.name) {
            dataUpdate.name = data.name
        }
        if (data.status && data.status != paymentMethod.status) {
            dataUpdate.status = data.status
        }
        let [err, result] = await to(this.PaymentMethodRepository.update({ id }, dataUpdate));
        if (err) {
            throw new HttpException("Update Payment Method", 500);
        }
        return result;
    }
}
