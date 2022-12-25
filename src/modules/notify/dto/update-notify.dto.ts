import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { TYPE_NOTIFY } from "src/common/enum";

export class UpdateNotifyDTO {
    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    link?: string;
}