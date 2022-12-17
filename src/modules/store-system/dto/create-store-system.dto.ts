import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { STORE_SYSTEM_STATUS } from "src/common/enum/store-system.enum";

export class CreateStoreSystemDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    time: string;

    @IsString()
    @IsNotEmpty()
    open_close: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsEmail()
    email: string;

    @IsString()
    address: string;

    @IsEnum(STORE_SYSTEM_STATUS)
    @IsOptional()
    status: STORE_SYSTEM_STATUS;
}