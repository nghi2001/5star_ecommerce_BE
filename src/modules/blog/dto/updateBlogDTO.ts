import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateBlogDTO {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    body: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    user_id: number;
}