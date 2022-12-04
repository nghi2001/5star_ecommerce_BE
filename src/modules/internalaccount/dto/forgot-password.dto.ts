import { IsEmail, IsString } from "class-validator";

export class GetResetPasswordTokenDTO {
    @IsString()
    @IsEmail()
    email: string;
}