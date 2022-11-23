import { IsNotEmpty, IsInt, IsNegative, IsPositive, IsString, IsEnum } from "class-validator";
export class CreateBannerDTO {
    @IsString()
    @IsNotEmpty()

    title: string;

    @IsString()
    @IsNotEmpty()
    sub_title: string;

    @IsString()
    image: string;

    @IsEnum({ ACTIVE: 1, NOT_ACTIVE: 2 })
    @IsPositive()
    status: number;
}