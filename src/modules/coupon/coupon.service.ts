import { HttpException, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { COUPON_STATUS, TypeCoupon } from 'src/common/enum';
import { CouponRepository } from './coupon.repository';
import { CreateCouponDTO } from './dto/create-coupon.dto';
import { UpdateCouponDTO } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
    constructor(private CouponRepository: CouponRepository) {

    }
    async renderCondition(query) {
        let {
            code,
            status,
            type
        } = query;

        let condition: any = {};
        if (code) {
            condition.code = code;
        }
        if (status) {
            condition.status = status;
        }
        if (type) {
            condition.type = type;
        }
        return condition;
    }
    async checkCode(code) {
        let checkData = await this.CouponRepository.getOne({ code: code });
        if (checkData) {
            return true;
        }
        return false;
    }

    async create(coupon: CreateCouponDTO) {
        let dataInsert = {
            code: coupon.code,
            expirate_date: coupon.expirate_date,
            start_date: coupon.start_date,
            quantity: coupon.quantity,
            type: coupon.type,
            discount: coupon.discount,
            min_order: coupon.min_order,
            max_order: coupon.max_order,
            status: coupon.status || COUPON_STATUS.ACTIVE
        };
        let checkData = await this.checkCode(dataInsert.code);
        let start_date = new Date(coupon.start_date);
        let expirate_date = new Date(coupon.expirate_date);
        let now = new Date();
        if (checkData) throw new HttpException("code already exits", 409);

        let checkStartDate = moment.isDate(start_date);
        let checkExpirateDate = moment.isDate(expirate_date) && moment(expirate_date).isAfter(start_date);

        if (!checkStartDate || !checkExpirateDate) {
            throw new HttpException("start date or expirate day not correct", 400);
        }
        dataInsert.expirate_date = moment(dataInsert.expirate_date).format("YYYY-MM-DD");
        let newCoupon = await this.CouponRepository.createCoupon(dataInsert);
        return newCoupon;
    }

    async getById(id: number) {
        let data = await this.CouponRepository.findOneBy({ id });
        return data;
    }

    async getList(filter, pager) {
        let data = await this.CouponRepository.getList(filter, pager);
        return data;
    }

    async destroy(id: number) {
        let result = await this.CouponRepository.delete({ id });
        return result;
    }

    checkStartDate(startDate: string | Date) {
        startDate = new Date(startDate);
        if (!moment.isDate(startDate)) {
            throw new HttpException("start date not type Date", 400);
        }
        // if (!moment(startDate).is(new Date)) {
        //     throw new HttpException("start date should be affter now", 400)
        // }
        return true;
    }
    checkExpirateDate(expirateDate: string | Date, startDate) {
        expirateDate = new Date(expirateDate);
        startDate = new Date(startDate);
        if (!moment.isDate(expirateDate)) {
            throw new HttpException("expirate date not type Date", 400);
        }
        if (!moment(expirateDate).isAfter(startDate)) {
            throw new HttpException("expirate date should be affter start date", 400)
        }
        return true;
    }
    async update(id, coupon: UpdateCouponDTO) {
        let {
            code,
            expirate_date,
            start_date,
            quantity,
            type,
            discount,
            min_order,
            max_price,
            status
        } = coupon;
        let dataUpdate: any = {};
        let startDate = new Date(start_date);
        let expirateDate = new Date(expirate_date);
        let data = await this.CouponRepository.getOne({ id });
        if (!data) {
            throw new HttpException("Coupon not found", 404);
        }
        if (status && status != data.status) {
            dataUpdate.status = status;
        }
        if (code && code != data.code) {
            let checkCode = await this.checkCode(code);
            if (!checkCode) throw new HttpException("code already exist", 409);
            dataUpdate.code = code;
        }
        if (start_date && moment(startDate).diff(moment(new Date(data.start_date)))) {
            if (this.checkStartDate(startDate)) {
                dataUpdate.start_date = moment(startDate).format("YYYY-MM-DD");
            }
        }
        if (expirate_date && moment(expirateDate).diff(new Date(data.expirate_date))) {
            if (this.checkExpirateDate(expirateDate, startDate)) {
                dataUpdate.expirate_date = moment(expirateDate).format("YYYY-MM-DD");
            }
        }
        if (quantity && quantity != data.quantity) {
            dataUpdate.quantity = quantity;
        }
        if (type && type != data.type) {
            dataUpdate.type = type;
        }
        if (discount && discount != data.discount) {
            dataUpdate.discount = discount;
        }
        if (min_order && min_order != data.min_order) {
            dataUpdate.min_order = min_order;
        }
        if (max_price && max_price != data.max_price) {
            dataUpdate.max_price = max_price;
        }
        if (Object.keys(dataUpdate).length > 0) {
            await this.CouponRepository.update({ id }, dataUpdate);
        }
        data = await this.getById(id);
        return data;
    }

    async checkCoupon(code: string, totalAmount: number) {
        let coupon = await this.CouponRepository.getOne({ code });
        if (!coupon) {
            return new Error("coupon not correct");
        }
        if (totalAmount < coupon.min_order) {
            return new Error("totalAmount can't use this coupon");
        }
        if (totalAmount > coupon.max_price) {
            coupon.type = TypeCoupon.CASH;
            coupon.discount = coupon.max_price;
        }
        let now = new Date();
        let expirateDate = new Date(coupon.expirate_date);
        let starDate = new Date(coupon.start_date);
        if (moment(now).isAfter(expirateDate) || moment(now).isBefore(starDate)) {
            return new Error("coupon not avaiable")
        }
        return coupon;
    }
}
