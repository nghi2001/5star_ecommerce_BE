import { IsDate, IsEnum, IsIn, IsInt, IsPositive, IsString } from "class-validator";
import { TypeCoupon } from "src/entity/coupon.entity";

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

    @IsInt()
    min_order: number;

    @IsInt()
    @IsPositive()
    max_order: number;
}