import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class updateCategoryDTO {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    slug: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    status: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    id_category: number;
}