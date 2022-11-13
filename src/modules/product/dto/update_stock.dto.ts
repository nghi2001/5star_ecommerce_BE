import { IsInt, IsOptional, IsPositive } from "class-validator";

export class UpdateStockDto {
    @IsInt()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    quantity?: number;

}