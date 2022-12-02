import { IsDate, IsEnum, IsIn, IsInt, IsString } from "class-validator";
import { TypeCoupon } from "src/entity/coupon.entity";

export class CreateCouponDTO {
    @IsString()
    code: string;

    @IsEnum(TypeCoupon)
    type: TypeCoupon;

    @IsDate()
    expirate_date: Date;

    @IsDate()
    start_date: Date;

    @IsInt()
    quantity: number;

    @IsInt()
    discount: number;

    @IsInt()
    min
}