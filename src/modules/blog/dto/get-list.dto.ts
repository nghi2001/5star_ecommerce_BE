import { IsEnum, IsInt, IsNumberString, IsOptional, IsString } from "class-validator";
import { TYPE_ORDER } from "src/common/enum";

export class GetListDTO {

    @IsNumberString()
    @IsOptional()
    perPage?: number

    @IsNumberString()
    @IsOptional()
    page?: number
    @IsOptional()
    @IsString()
    orderBy?: string;

    @IsEnum(TYPE_ORDER)
    @IsOptional()
    orderType?: string;
}