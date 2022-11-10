import { IsIn, IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    body: string;

    @IsInt()
    @IsPositive()
    parent_id: number;

    @IsInt()
    @IsPositive()
    user_id: number;

    @IsInt()
    @IsPositive()
    blog_id: number;
}