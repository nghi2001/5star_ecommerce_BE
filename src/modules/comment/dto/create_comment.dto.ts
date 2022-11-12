import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    body: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    parent_id?: number;

    @IsInt()
    @IsPositive()
    blog_id: number;
}