import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDTO {
    @IsString()
    email: string

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    newPass: string

    @IsString()
    @IsNotEmpty()
    confirmPass: string
}