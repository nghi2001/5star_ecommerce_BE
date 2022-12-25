import { IsEnum } from "class-validator";
import { Role } from "src/common/enum";
export class changeRoleDTO {

    @IsEnum(Role, { each: true })
    role: Role[]
}