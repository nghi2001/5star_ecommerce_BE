import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { RATING_STATUS } from "src/common/enum";

export class UpdateRatingDTO {
    @IsInt()
    @Min(1)
    @Max(5)
    @IsOptional()
    rating?: number;

    @IsString()
    @IsOptional()
    content?: string;

    @IsEnum(RATING_STATUS)
    @IsOptional()
    status?: RATING_STATUS
}