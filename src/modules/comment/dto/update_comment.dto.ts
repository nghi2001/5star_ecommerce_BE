import { IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";
import { STATUS_COMMENT } from "src/common/enum";

export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    body?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    parent_id?: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    user_id?: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    blog_id?: number;

    @IsEnum(STATUS_COMMENT)
    @IsOptional()
    status?: STATUS_COMMENT
}