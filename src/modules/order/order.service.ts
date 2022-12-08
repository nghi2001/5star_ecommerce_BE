import { HttpException, Injectable } from '@nestjs/common';
import { TypeCoupon } from 'src/entity/coupon.entity';
import { DataSource } from 'typeorm';
import { CouponService } from '../coupon/coupon.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderRepository } from './order.repository';
import { ProductService } from '../product/product.service';
import { OrderDetail } from 'src/entity/order _detail';
import { OrderDetailRepository } from './order_detail.repository';
import { ORDER_STATUS } from '../../entity/order';

@Injectable()
export class OrderService {
    constructor(
        private CouponService: CouponService,
        private OrderRepository: OrderRepository,
        private OrderDetailRepository: OrderDetailRepository,
        private productService: ProductService
    ) {

    }

    async create(data: CreateOrderDto, user) {
        let coupon_id = null
        if (data.coupon) {
            let checkCoupon = await this.CouponService.checkCoupon(data.coupon, data.total)
            if (checkCoupon instanceof Error) {
                throw new HttpException(checkCoupon.message, 400);
            }
            if (checkCoupon.type == TypeCoupon.CASH) {
                data.total -= checkCoupon.discount;
            }
            if (checkCoupon.type == TypeCoupon.PERCENT) {
                let discount = (data.total / 100) * checkCoupon.discount;
                checkCoupon.discount -= discount;
            }
            coupon_id = checkCoupon.id
        }
        console.log(user);

        data.user_id = user.id;
        let order = await this.OrderRepository.createOrder(data, coupon_id);
        let listOrderDetail = [];
        let productInserted = []
        for (let item of data.products) {
            let product = await this.productService.getStockById(item.id_product);

            if (product) {
                if (item.quantity > product.quantity) {
                    this.OrderRepository.delete({ id: order.raw[0].id });
                    throw new HttpException(`Product ${product.id} out of stock`, 400);
                }
                listOrderDetail.push({
                    order_id: order.raw[0].id,
                    product_id: product.id,
                    quantity: item.quantity,
                    price: product.price
                })
                productInserted.push({
                    id: product.id,
                    quantity: product.quantity - item.quantity
                })
            }
        }
        if (listOrderDetail.length == 0) {
            this.OrderRepository.delete({ id: order.raw[0].id });
            throw new HttpException("can't create order", 400)
        }
        let orderDetail = await this.OrderDetailRepository.createOrderDetail(listOrderDetail);
        for (let e of productInserted) {
            await this.productService.updateStock(e.id, { quantity: e.quantity })
        }
        let dataResponse = await this.OrderRepository.getOne(order.raw[0].id);
        return dataResponse
    }

    async find(id: number) {
        let order = await this.OrderRepository.getOne(id);
        if (order) {
            return order;
        }
        throw new HttpException("Order Not Found", 404);
    }

    async updateStatusOrder(id: number, status: ORDER_STATUS) {
        let result = await this.OrderRepository.update({ id: id }, {
            order_status: status
        })
    }
    sortObject(obj) {
        var sorted = {};
        var str = [];
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
}
