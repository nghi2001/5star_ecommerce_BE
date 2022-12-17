import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PAYMENT_METHOD_STATUS } from "src/common/enum";

export class CreatePaymentMethodDTO {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(PAYMENT_METHOD_STATUS)
    @IsOptional()
    status?: PAYMENT_METHOD_STATUS;
}