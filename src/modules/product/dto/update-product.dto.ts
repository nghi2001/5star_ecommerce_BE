import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    info_detail?: string[];

    @IsNotEmpty()
    @IsArray()
    @IsOptional()
    image?: string[];

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    slug?: string;

    @IsEnum({ ACTIVE: 1, UNACTIVE: 2 })
    @IsOptional()
    status?: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    id_category?: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    id_subcategory?: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    id_brand?: number;

}