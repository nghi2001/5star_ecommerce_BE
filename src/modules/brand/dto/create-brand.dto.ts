import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BRAND_STATUS } from "src/common/enum";


export class CreateBrandDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsOptional()
    @IsEnum(BRAND_STATUS)
    status: BRAND_STATUS;
}