import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDTO {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    newPassword: string

    @IsString()
    @IsNotEmpty()
    confirmPassword
}