import { IsDate, IsEnum, IsIn, IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { COUPON_STATUS, TypeCoupon } from "src/common/enum";

export class CreateCouponDTO {
    @IsString()
    code: string;

    @IsEnum(TypeCoupon)
    type: TypeCoupon;

    expirate_date: string;

    // @IsDate()
    start_date: string;

    @IsInt()
    @IsPositive()
    quantity: number;

    @IsInt()
    discount: number;

    @IsEnum(COUPON_STATUS)
    @IsOptional()
    status: COUPON_STATUS;

    @IsInt()
    min_order: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    max_price?: number;


}