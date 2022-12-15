import { IsString, MaxLength, IsNotEmpty, IsNotEmptyObject, IsEmail, IsOptional, IsIn, IsInt } from "class-validator";
export class updateUserDTO {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    email?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    first_name?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    last_name?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    phone?: string


    @IsString()
    @IsNotEmpty()
    @IsOptional()
    birth_day?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    gender?: string

    @IsOptional()
    address?: any

    @IsInt()
    @IsOptional()
    avatar_id: string;
}