import { IsString } from 'class-validator'
export class RevokeDeviceDTO {
    @IsString()
    hash: string;
}