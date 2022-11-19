import { IsInt, IsPositive } from "class-validator";

export class createCardDto {

    @IsInt()
    @IsPositive()
    id_product: number;

    @IsInt()
    quantity: number;
}