import { IsDate, IsEnum, IsIn, IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { TypeCoupon } from "src/entity/coupon.entity";

export class UpdateCouponDTO {
    @IsString()
    @IsOptional()
    code: string;

    @IsEnum(TypeCoupon)
    @IsOptional()
    type: TypeCoupon;

    expirate_date: string;

    // @IsDate()
    start_date: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    quantity: number;

    @IsInt()
    @IsOptional()
    discount: number;

    @IsInt()
    @IsOptional()
    min_order: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    max_order: number;
}