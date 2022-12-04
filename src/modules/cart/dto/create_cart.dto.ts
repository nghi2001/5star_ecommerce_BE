import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class createCartDto {

    @IsInt()
    @IsPositive()
    id_product: number;

    @IsInt()
    quantity: number;

    @IsString()
    @IsOptional()
    image: string;
}