import { IsEnum } from "class-validator";
import { ORDER_STATUS } from "src/entity/order";

export class UpdateStatusDTO {
    @IsEnum(ORDER_STATUS)
    status: ORDER_STATUS
}