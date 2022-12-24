import { HttpException, Injectable } from '@nestjs/common';
import { TypeCoupon } from 'src/common/enum';
import { CouponService } from '../coupon/coupon.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderRepository } from './order.repository';
import { ProductService } from '../product/product.service';
import { OrderDetailRepository } from './order_detail.repository';
import { ORDER_STATUS } from 'src/common/enum';
import { PaymentMethodService } from '../payment-method/payment-method.service';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { Request } from 'express';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as querystring from 'qs';
import { v4 } from 'uuid';
import { In, DataSource } from 'typeorm';
import { Order } from 'src/entity/order';
import { OrderDetail } from 'src/entity/order _detail';
import { to } from 'src/common/helper/catchError';
@Injectable()
export class OrderService {
    constructor(
        private CouponService: CouponService,
        private OrderRepository: OrderRepository,
        private OrderDetailRepository: OrderDetailRepository,
        private productService: ProductService,
        private PaymentMethodService: PaymentMethodService,
        private ConfigService: ConfigService
    ) {

    }

    async renderCondition(query) {
        let {
            user_id,
            status
        } = query;
        let condition: any = {};
        if (user_id) {
            condition.user_id = user_id;
        }
        if (status) {
            condition.status = status;
        }
        return condition;
    }

    async getList(filter = {}, pagination = {}) {
        let data = await this.OrderRepository.getList(filter, pagination);
        return data;
    }
    async create(data: CreateOrderDto, user) {
        const queryRunner = this.OrderRepository.dataSource.createQueryRunner();
        await queryRunner.startTransaction()
        let coupon_id = null
        if (data.coupon) {
            let checkCoupon = await this.CouponService.checkCoupon(data.coupon, data.total)
            if (checkCoupon instanceof Error) {
                await queryRunner.rollbackTransaction()
                await queryRunner.release();
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
        let checkPaymetMethod = await this.PaymentMethodService.getOne(data.payment_method_id);
        if (!checkPaymetMethod) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new HttpException("payment_method_id not found", 404);
        }
        data.user_id = user.id;
        let orderObj = this.OrderRepository.createOrderObject(data, coupon_id);
        let [errCreateOrder, order] = await to(queryRunner.manager.save(orderObj));
        if (errCreateOrder) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new HttpException("Can't create order", 500);
        }
        let listOrderDetail = [];
        let productInserted = []
        for (let item of data.products) {
            let product = await this.productService.getStockById(item.id_product);
            if (product) {
                if (item.quantity > product.quantity) {
                    await queryRunner.rollbackTransaction();
                    await queryRunner.release();
                    throw new HttpException(`Product ${product.id} out of stock`, 400);
                }
                listOrderDetail.push({
                    order_id: order.id,
                    product_id: product.id,
                    quantity: item.quantity,
                    product_info: product,
                    price: product.price
                })
                productInserted.push({
                    id: product.id,
                    quantity: product.quantity - item.quantity
                })
            }
        }
        if (listOrderDetail.length == 0) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new HttpException("can't create order", 400)
        }
        try {
            await queryRunner.manager.createQueryBuilder()
                .insert()
                .into(OrderDetail)
                .values(listOrderDetail)
                .execute()
        } catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new HttpException("Can't create order", 500);
        };
        for (let e of productInserted) {
            let [err, data] = await to(this.productService.updateStock(e.id, { quantity: e.quantity }));
            if (err) {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
                throw new HttpException("Can't create order", 500)
            }
        }
        await queryRunner.commitTransaction();
        await queryRunner.release();
        let dataResponse = await this.OrderRepository.getOne(order.id);
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
            status: status
        })
    }

    async update(id: number, updateData: UpdateOrderDTO) {
        let dataUpdate: UpdateOrderDTO = {};
        let order = await this.OrderRepository.findOneBy({ id });
        if (!order) {
            throw new HttpException("Order not found", 404);
        }
        if (updateData.status && updateData.status != order.status) {
            dataUpdate.status = updateData.status;
        }
        if (updateData.payment_code && updateData.payment_code != order.payment_code) {
            dataUpdate.payment_code = updateData.payment_code;
        }
        let data = await this.OrderRepository.update({ id }, dataUpdate);
        return data;

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

    async getLinkPaymentVNPAY(order_id: number, req: Request) {
        let order = await this.find(order_id);
        if (!order) {
            throw new HttpException("Order not found", 404);
        }
        let now: Date | string = new Date();
        let paymentCode = v4();
        // let refCode = moment(now).format('ymdHms');
        now = moment(now).format("YYYYMMDDHHmmss")
        let vnp_Params = {};
        vnp_Params['vnp_Amount'] = order.total * 100;
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_CreateDate'] = now;
        vnp_Params['vnp_CurrCode'] = "VND";
        vnp_Params['vnp_IpAddr'] = req.ip || '127.0.0.1';
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_OrderInfo'] = order.name || "Đơn hàng 5starshion";
        vnp_Params['vnp_OrderType'] = "topup"
        vnp_Params['vnp_ReturnUrl'] = this.ConfigService.get<string>("RETURN_URL");
        vnp_Params['vnp_TmnCode'] = this.ConfigService.get<string>("VNP_TMNCODE")
        vnp_Params['vnp_TxnRef'] = paymentCode;
        vnp_Params['vnp_Version'] = '2.1.0';
        let secretKey = this.ConfigService.get<string>("VNP_SECRET");
        let link = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?`;
        vnp_Params = this.sortObject(vnp_Params);
        let signData = null
        signData = querystring.stringify(vnp_Params, {
            encode: false
        });
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        vnp_Params['vnp_SecureHash'] = signed
        signData =
            signData = querystring.stringify(vnp_Params, {
                encode: false
            });
        link += signData;
        if (link) {
            this.update(order_id, { payment_code: paymentCode })
        }
        return link
    }

    async checkUserIsOrder(id_user, id_products: number[]) {
        let data = await this.OrderRepository.checkUserIsOrder(id_user, id_products);
        return data
    }
}
