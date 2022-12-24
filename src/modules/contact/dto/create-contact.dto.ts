import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateContactDTO {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsEmail()
    email?: string;

    @IsString()
    @IsOptional()
    message?: string;

    @IsString()
    @IsOptional()
    phone?: string;
}