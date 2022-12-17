import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { STORE_SYSTEM_STATUS } from "src/common/enum/store-system.enum";

export class UpdateStoreSystemDTO {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    time?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    open_close?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    phone?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsEnum(STORE_SYSTEM_STATUS)
    @IsOptional()
    status?: STORE_SYSTEM_STATUS;
}