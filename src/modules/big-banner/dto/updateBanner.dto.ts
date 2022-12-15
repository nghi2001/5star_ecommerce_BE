import { IsNotEmpty, IsInt, IsNegative, IsPositive, IsString, IsEnum, IsOptional } from "class-validator";
import { BANNER_STATUS } from "src/entity/banner.entity";
export class UpdateBannerDTO {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    sub_title?: string;

    @IsInt()
    @IsOptional()
    image?: number;

    @IsEnum(BANNER_STATUS)
    @IsOptional()
    status?: BANNER_STATUS;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    link?: string;
}