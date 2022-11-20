import { IsInt, IsPositive } from "class-validator";

export class createCartDto {

    @IsInt()
    @IsPositive()
    id_product: number;

    @IsInt()
    quantity: number;
}