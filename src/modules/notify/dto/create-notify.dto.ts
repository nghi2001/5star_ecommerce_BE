import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { TYPE_NOTIFY } from "src/common/enum";

export class CreaeteNotifyDTO {
    @IsString()
    content: string;

    @IsEnum(TYPE_NOTIFY)
    type: TYPE_NOTIFY;

    @IsString()
    @IsOptional()
    link?: string;

    @IsInt({ each: true })
    @IsOptional()
    to: number[]
}