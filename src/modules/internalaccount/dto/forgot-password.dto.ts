import { IsEmail, IsString } from "class-validator";

export class forgotPasswordDto {
    @IsString()
    @IsEmail()
    email: string;
}