import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";
import { MediaFile } from "src/entity/media.entity";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    info_detail: string[];

    @IsNotEmpty()
    @IsArray()
    images: MediaFile[];

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsInt()
    @IsPositive()
    id_category: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    id_brand: number;

    @IsArray()
    classify_1: { attribute: string }[]
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    classify_2: { attribute: string }[]

    @IsBoolean()
    isClassify_1: boolean;

    @IsBoolean()
    isClassify_2: boolean

    variable_attribute: {
        price: any,
        quantity: any
    }[]
}