import { Injectable } from "@nestjs/common";
import { Repository, DataSource, In, SubjectRemovedAndUpdatedError } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "src/entity/order";
import { ORDER_STATUS } from "src/common/enum";

@Injectable()
export class OrderRepository extends Repository<Order> {
    dataSource: DataSource
    constructor(
        dataSource: DataSource
    ) {
        super(Order, dataSource.createEntityManager())
        this.dataSource = dataSource;
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
                    user_id: order.user_id,
                    payment_method_id: order.payment_method_id
                }]
            )
            .execute();
        console.log(order);

        return data
    }

    createOrderObject(data: CreateOrderDto, coupon_id = null, status: ORDER_STATUS) {
        let order = new Order();
        if (status) {
            order.status = status;
        }
        order.address = data.address;
        order.coupon_id = coupon_id;
        order.name = data.name;
        order.note = data.note;
        order.phone = data.phone;
        order.total = data.total;
        order.user_id = data.user_id;
        order.payment_method_id = data.payment_method_id;
        return order;
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

        return order
    }

    async getList(filter = {}, pagination = {}) {
        let data = await this.find({
            where: filter,
            order: {
                id: 'ASC'
            },
            relations: {
                details: true,
                user: true
            },
            ...pagination
        });
        let total = await this.count({
            where: filter
        });
        return {
            total,
            data
        };
    }

    async checkUserIsOrder(id_user, id_products) {
        let data = await this.findOne({
            where: {
                user_id: id_user,
                details: {
                    product_id: In(id_products)
                }
            },
            select: [
                'id'
            ]
        })
        return data
    }

    async sumOrder(filter = {}) {
        let query = await this.createQueryBuilder("order");
        Object.keys(filter).forEach(key => {
            if (filter[key]) {
                let value: any = {};
                value[`${key}`] = filter[key];
                query.andWhere(`${key} = :${key}`, value)
            }
            console.log(key);
        });
        query.select("SUM(order.total)", "sum")
        let sum = await query.getRawOne();
        return sum
    }
}