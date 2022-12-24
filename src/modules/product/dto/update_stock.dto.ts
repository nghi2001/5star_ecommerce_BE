import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class UpdateStockDto {
    @IsInt()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    quantity?: number;

}