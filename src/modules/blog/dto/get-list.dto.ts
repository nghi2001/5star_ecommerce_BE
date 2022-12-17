import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { TYPE_ORDER } from "src/common/enum";

export class GetListDTO {

    @IsInt()
    @IsOptional()
    perPage?: number

    @IsInt()
    @IsOptional()
    page?: number
    @IsOptional()
    @IsString()
    orderBy?: string;

    @IsEnum(TYPE_ORDER)
    @IsOptional()
    orderType?: string;
}