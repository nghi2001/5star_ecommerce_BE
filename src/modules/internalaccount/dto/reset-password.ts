import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDTO {
    @IsString()
    token: string

    @IsString()
    @IsNotEmpty()
    newPass: string

    @IsString()
    @IsNotEmpty()
    confirmPass: string
}