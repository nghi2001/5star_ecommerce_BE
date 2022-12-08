import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
class ProductParams {
    @IsInt()
    @IsPositive()
    id_product: number;
    @IsInt()
    @IsPositive()
    quantity: number;
}
export class CreateOrderDto {
    @IsOptional()
    @IsString()
    coupon?: string;

    // delivery info
    @IsString()
    name: string;
    @IsString()
    phone: string;
    @IsString()
    address: string;
    @IsString()
    note: string;
    @IsNumber()
    total: number;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ProductParams)
    products: ProductParams[]

    user_id?: number;
}