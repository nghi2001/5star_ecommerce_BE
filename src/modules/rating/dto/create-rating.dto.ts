import { IsInt, IsString, Max, Min } from "class-validator";

export class CreateRatingDTO {
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    content: string;

    @IsInt()
    id_product: number;
}