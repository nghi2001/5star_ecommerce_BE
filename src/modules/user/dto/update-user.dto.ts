import { IsString, MaxLength, IsNotEmpty, IsNotEmptyObject, IsEmail, IsOptional } from "class-validator";
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
    gender?: string

    @MaxLength(20,{each: true})
    @IsNotEmpty()
    @IsOptional()
    address?: string[]
}