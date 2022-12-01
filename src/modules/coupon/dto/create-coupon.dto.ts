import { IsString } from "class-validator";

export class CreateCouponDTO {
    @IsString()
    code: string;
}