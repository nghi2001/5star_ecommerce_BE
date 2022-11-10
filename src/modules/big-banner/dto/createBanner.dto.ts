import { IsNotEmpty, IsInt, IsNegative, IsPositive, IsString } from "class-validator";
export class CreateBannerDTO {
    @IsString()
    @IsNotEmpty()

    title: string;

    @IsString()
    @IsNotEmpty()
    sub_title: string;
    
    // @IsString()
    // image: string;

    @IsInt()
    @IsPositive()
    status: number;
}