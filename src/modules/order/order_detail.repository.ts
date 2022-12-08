import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "src/entity/order";
import { OrderDetail } from "src/entity/order _detail";

@Injectable()
export class OrderDetailRepository extends Repository<OrderDetail> {

    constructor(
        dataSource: DataSource
    ) {
        super(OrderDetail, dataSource.createEntityManager())
    }

    async createOrderDetail(orderDetail) {
        let data = await this.createQueryBuilder()
            .insert()
            .into(OrderDetail)
            .values(
                orderDetail
            )
            .execute();
        return data
    }
}