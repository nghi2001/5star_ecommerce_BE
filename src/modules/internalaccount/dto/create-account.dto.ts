import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateAccountDto {
    @IsInt()
    id_profile: number;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}