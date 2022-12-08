import { IsIn, IsInt, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
    @IsOptional()
    @IsInt()
    coupon_id?: number;

    @IsInt()
    order_method: number;

    @IsString()
    name: string;
    @IsString()
    phone: string;
    @IsString()
    address: string;
    @IsString()
    note: string;
    @IsString()
    total: string;

}