import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";
import { BLOG_STATUS } from "src/common/enum";

export class CreateBlogDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsInt()
    @IsOptional()
    image?: number

    @IsEnum(BLOG_STATUS)
    @IsOptional()
    status?: BLOG_STATUS

    @IsString()
    slug: string
}