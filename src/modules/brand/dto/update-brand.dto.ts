import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BRAND_STATUS } from "src/common/enum";


export class UpdateBrandDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    slug: string;


    @IsOptional()
    @IsEnum(BRAND_STATUS)
    status: BRAND_STATUS;
}