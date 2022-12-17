import { IsNotEmpty, IsString } from "class-validator";

export class PaymentResultDTO {
    @IsString()
    @IsNotEmpty()
    payment_code: string;
}