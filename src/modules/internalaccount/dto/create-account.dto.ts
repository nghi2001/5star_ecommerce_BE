import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateAccountDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    first_name?: string;

    @IsString()
    @IsNotEmpty()
    last_name?: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    id_profile: number;
}