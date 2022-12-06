import { IsEnum } from "class-validator";
import { Role } from "src/common/enum/role.enum";
export class changeRoleDTO {

    @IsEnum(Role)
    role: Role
}