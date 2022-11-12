import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

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
}