import { IsArray, IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsArray()
    image: string[];

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsInt()
    @IsPositive()
    status: number;

    @IsInt()
    @IsPositive()
    id_category: number;

    @IsInt()
    @IsPositive()
    id_subcategory: number;

    @IsInt()
    @IsPositive()
    id_brand: number;

}