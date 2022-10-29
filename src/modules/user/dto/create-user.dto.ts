import { IsString, MaxLength, IsNotEmpty, IsNotEmptyObject, IsEmail } from "class-validator";
export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    first_name: string

    @IsString()
    @IsNotEmpty()
    last_name: string

    @IsString()
    @IsNotEmpty()
    phone: string

    @IsString()
    @IsNotEmpty()
    gender: string

    @MaxLength(20,{each: true})
    @IsNotEmpty()
    address: string[]

    @IsNotEmptyObject()
    account: any
}