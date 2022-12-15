import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InternalaccountService } from '../internalaccount/internalaccount.service';
import { InjectQueue } from "@nestjs/bull";
import { Queue } from 'bull';
@Injectable()
export class AuthService {
    constructor(
        private UserService: UserService,
        private InternalAccountService: InternalaccountService,
        private JwtService: JwtService,
        private ConfigService: ConfigService,
        @InjectQueue("mail") private mailQueue: Queue
    ) {
    }

    async verifyPassword(password, hash) {
        let compare = await bcrypt.compare(password, hash);
        if (compare) {
            return true;
        }
        throw new HttpException("wrong password", HttpStatus.FORBIDDEN)
    }
    async SigIn(data: AuthDTO, deviceInfo, hashAndIp) {
        let user = await this.InternalAccountService.checkAccountExist(data.username);
        let verifyPass = await this.verifyPassword(data.password, user.password);

        if (verifyPass) {
            let profile = await this.UserService.findOne(user.id_profile);
            let tokens = await this.getTokens({ id: user.id, roles: profile.roles });
            await this.updateRefreshToken(tokens.refreshToken, user.id, hashAndIp, deviceInfo)
            return tokens
        }
    }

    async getTokens(payload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.JwtService.signAsync(payload, {
                secret: this.ConfigService.get<string>("JWT_ACCESS_SECRET"),
                expiresIn: this.ConfigService.get<string>("ACCESS_TOKEN_EXPIRATE") || '40m'
            }),
            this.JwtService.signAsync(payload, {
                secret: this.ConfigService.get<string>("JWT_REFRESH_SECRET"),
                expiresIn: this.ConfigService.get<string>("REFRESH_TOKEN_EXPIRATE") || '7d'
            })
        ]);

        return {
            accessToken, refreshToken
        }
    }

    async updateRefreshToken(refreshToken: string, id: number, ipHash: string = 'default', deviceInfo?) {
        let account = await this.InternalAccountService.findOne(id);
        if (ipHash) {
            if (!account.refresh_token[ipHash]) {
                //send mail
                this.mailQueue.add({
                    to: account.email,
                    subject: "Cảnh Báo Thiết bị lạ đăng nhập",
                    html: `
                        <h2>Một thiết bị lạ đẫ đăng nhập tài khoản của bạn nếu đó không phải bạn hãy xóa quyền đăng nhập của thiết bị đó và đổi mật khẩu</h2></br>
                        ${deviceInfo}
                        `
                })
            }
            account.refresh_token[ipHash] = {
                refreshToken: refreshToken,
                deviceInfo: deviceInfo
            }

            await this.InternalAccountService.update(id, { refresh_token: account.refresh_token })
        } else {
            return false;
        }
    }

    async revokeRefreshToken(id: number, hash: string = 'default') {
        let account = await this.InternalAccountService.findOne(id);
        if (account.refresh_token[hash]) {
            delete account.refresh_token[hash];
            let result = await this.InternalAccountService.update(id, { refresh_token: account.refresh_token });
            return result;
        }
    }

    getDeviceInfo(req) {
        let fingerprint: any = req.fingerprint
        let OS = fingerprint.components.useragent.os.family;
        let device = fingerprint.components.useragent.device.family;
        let browser = fingerprint.components.useragent.browser.family;
        let device_info = `
            <p>Thiết bị: ${device}</p></br>
            <p>Trình duyệt: ${browser}</p></br>
            <p>OS: ${OS}</p></br>
            <p>Địa điểm: ${req.ipInfo}</p></br>
        `
        let hashAndIp = fingerprint.hash;
        return {
            device_info,
            hashAndIp
        }
    }
}
