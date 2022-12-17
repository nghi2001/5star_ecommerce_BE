import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum } from "class-validator";
import { BLOG_STATUS } from "src/common/enum";

export class UpdateBlogDTO {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    content?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    body?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsOptional()
    image?: number


    @IsEnum(BLOG_STATUS)
    @IsOptional()
    status?: BLOG_STATUS
}