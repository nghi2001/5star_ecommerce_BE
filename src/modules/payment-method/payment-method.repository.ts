import { Injectable } from "@nestjs/common";
import { PAYMENT_METHOD_STATUS } from "src/common/enum";
import { PaymentMethod } from "src/entity/payment-method.entity";
import { DataSource, Repository } from "typeorm";
import { CreatePaymentMethodDTO } from "./dto/create-payment-method.dto";

@Injectable()
export class PaymentMethodRepository extends Repository<PaymentMethod> {
    constructor(
        dataSource: DataSource
    ) {
        super(PaymentMethod, dataSource.createEntityManager())
    }

    async createPaymentMethod(data: CreatePaymentMethodDTO) {
        let paymentMethod = new PaymentMethod();
        paymentMethod.name = data.name || null;
        paymentMethod.status = data.status || PAYMENT_METHOD_STATUS.ACTIVE;
        await paymentMethod.save();
        return paymentMethod;
    }

    async getList(filter = {}, pagination = {}) {
        let data = await this.find({
            where: filter,
            order: {
                id: 'ASC'
            },
            ...pagination
        });
        let total = await this.count({
            where: filter
        });
        return { total, data }
    }
}