import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "src/entity/order";

@Injectable()
export class OrderRepository extends Repository<Order> {

    constructor(
        dataSource: DataSource
    ) {
        super(Order, dataSource.createEntityManager())
    }

    async createOrder(order: CreateOrderDto, coupon_id = null) {
        let data = await this.createQueryBuilder()
            .insert()
            .into(Order)
            .values(
                [{
                    address: order.address,
                    coupon_id: coupon_id,
                    name: order.name,
                    note: order.note,
                    phone: order.phone,
                    total: order.total,
                    user_id: order.user_id
                }]
            )
            .execute();
        return data
    }

    async getOne(id: number) {
        let order = await this.createQueryBuilder('order')
            .where("order.id = :id", { id: id })
            .leftJoin("order.details", 'order_detail')
            .leftJoin("order.user", 'user')
            .select([
                'order_detail',
                "order",
                "user"
            ])
            .getOne()
        console.log(order);

        return order
    }
}