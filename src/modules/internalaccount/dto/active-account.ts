import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ActiveAccountDTO {
    @IsString()
    email: string

    @IsString()
    @IsNotEmpty()
    code: string;
}