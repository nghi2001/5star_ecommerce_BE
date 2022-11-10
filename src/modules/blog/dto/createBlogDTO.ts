import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CreateBlogDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsInt()
    @IsPositive()
    user_id: number;
}