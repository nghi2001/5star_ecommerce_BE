import { IsArray, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description: string;

    @IsNotEmpty()
    @IsArray()
    @IsOptional()
    image: string[];

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

    @IsInt()
    @IsPositive()
    @IsOptional()
    id_subcategory: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    id_brand: number;

}