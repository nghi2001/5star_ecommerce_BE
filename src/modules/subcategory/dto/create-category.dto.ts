import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

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
    id_category: number;
}