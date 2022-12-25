import { IsNotEmpty, IsString } from "class-validator";

export class StatisticFromTo {
    @IsString()
    @IsNotEmpty()
    date_from: string;

    @IsString()
    @IsNotEmpty()
    date_to: string;
}