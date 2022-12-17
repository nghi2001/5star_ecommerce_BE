import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { ORDER_STATUS } from "src/common/enum";

export class UpdateOrderDTO {
    @IsEnum(ORDER_STATUS)
    status?: ORDER_STATUS;

    @IsString()
    payment_code?: string;
}