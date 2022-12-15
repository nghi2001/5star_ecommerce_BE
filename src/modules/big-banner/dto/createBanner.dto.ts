import { IsNotEmpty, IsInt, IsNegative, IsPositive, IsString, IsEnum } from "class-validator";
import { BANNER_STATUS } from "src/entity/banner.entity";
export class CreateBannerDTO {
    @IsString()
    @IsNotEmpty()

    title: string;

    @IsString()
    @IsNotEmpty()
    sub_title: string;

    @IsInt()
    image: number;

    @IsEnum(BANNER_STATUS)
    @IsPositive()
    status: BANNER_STATUS;

    @IsString()
    @IsNotEmpty()
    link: string;
}