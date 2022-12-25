import { IsNotEmpty, IsString } from "class-validator";

export class LoginGGDTO {
    @IsString()
    @IsNotEmpty()
    token: string;
}