import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class getSignedUrlDTO {
    @IsString()
    @IsNotEmpty()
    type: string
}