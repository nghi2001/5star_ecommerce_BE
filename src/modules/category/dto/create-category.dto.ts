import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class createCategoryDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsInt()
    @IsPositive()
    status: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    parent_id?: number;
}