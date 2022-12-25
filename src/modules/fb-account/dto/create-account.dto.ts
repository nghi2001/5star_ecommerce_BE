import { IsNotEmpty, IsString } from "class-validator";

export class CreateFbAccountDTO {
    @IsString()
    @IsNotEmpty()
    uid: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}