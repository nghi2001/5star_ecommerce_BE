import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InternalAccountRepository } from './internalaccount.repository';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ACCOUNT_STATUS, InternalAccount } from '../../entity/internal_account.entity';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { to } from 'src/common/helper/catchError';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import e from 'express';
import { ResetPasswordDTO } from './dto/reset-password';
@Injectable()
export class InternalaccountService {
    constructor(
        private UserService: UserService,
        private InternalAccountRepository: InternalAccountRepository,
        private JwtService: JwtService,
        private ConfigService: ConfigService
    ) { }

    async verifyToken(token: string) {
        let result = await this.JwtService.verifyAsync(token, {
            secret: this.ConfigService.get("JWT_RESETPASS_SECRET")
        })
        return result;
    }
    async generateResetPassToken(payload) {
        let token = await this.JwtService.signAsync(payload, {
            secret: this.ConfigService.get("JWT_RESETPASS_SECRET"),
            expiresIn: '30m'
        });
        return token;
    }
    async hashPassWord(password: string): Promise<string> {
        let salt = await bcrypt.genSalt();
        let hashPass = await bcrypt.hash(password, salt);
        return hashPass
    }
    async show() {
        let result = await this.InternalAccountRepository.find({
            select: [
                'id',
                'email',
                'id_profile',
                'profile',
                'create_at',
                'update_at',
                'status'
            ]
        });
        return result
    }
    async checkProfileExit(id: number) {
        let checkProfileExist = await this.UserService.findOne(id);
        if (checkProfileExist) {
            return true
        } else {
            throw new HttpException("User Not Exist", HttpStatus.NOT_FOUND);
        }
    }
    async checkAccountNotExist(email: string, id_profile?: number) {
        let check = await this.InternalAccountRepository.findOneBy({ email });
        if (check) {
            throw new HttpException("User exist", 400);
        } return true;
    }
    async checkAccountExist(email: string) {
        let check = await this.InternalAccountRepository.findOneBy({ email });
        if (check) {
            return check
        }
        throw new HttpException("User Not Exist", HttpStatus.NOT_FOUND)
    }
    async findOne(id: number) {
        let result = await this.InternalAccountRepository.findOneBy({ id });
        return result
    }
    async create(account: CreateAccountDto) {
        let checkAccountNotExist = await this.checkAccountNotExist(account.email);
        if (checkAccountNotExist) {

            account.password = await this.hashPassWord(account.password);
            let profile = await this.UserService.createProfile({
                first_name: account.first_name,
                last_name: account.last_name,
                email: account.email
            });

            let result = await this.InternalAccountRepository.createAccount({
                email: account.email,
                password: account.password,
                id_profile: profile.raw[0].id
            });

            return profile.raw[0]
        }
    }

    async destroy(id: number) {
        let account = await this.findOne(id);

        let result = await this.InternalAccountRepository.delete({ id });
        await this.UserService.deleteUser(account.id_profile);
        return result
    }

    async update(id: number, data) {
        let result = await this.InternalAccountRepository.update({ id }, data)
        return result
    }

    async getUserInfo(username: string) {
        let data = await this.InternalAccountRepository.findUserInfo(username);
        return data
    }

    checkConfirmPass(password, confirmPassword) {
        if (password != confirmPassword) {
            return false;
        }
        return true;
    }
    async updatePass(data: UpdatePasswordDTO) {
        let {
            username,
            password,
            newPassword,
            confirmPassword
        } = data;
        if (!this.checkConfirmPass(newPassword, confirmPassword)) {
            throw new HttpException("Confirm Password not match with NewPassword", 400);
        }
        let user = await this.InternalAccountRepository.findByUserName(username);
        if (!user) {
            throw new HttpException("username or password not", 400);
        }
        if (!bcrypt.compareSync(password, user.password)) {
            throw new HttpException("username or password not correct", 400);
        }
        let hashPassWord = await this.hashPassWord(newPassword);
        let [err, result] = await to(this.InternalAccountRepository.update({ email: username }, {
            password: hashPassWord
        }))
        if (err) {
            throw new HttpException("Error Update Password", 500);
        }
        return result;
    }
    async resetPass(data: ResetPasswordDTO) {
        let {
            email,
            confirmPass,
            newPass
        } = data;
        if (!this.checkConfirmPass(newPass, confirmPass)) {
            throw new HttpException("Confirm Password not match with NewPassword", 400);
        }
        let hashPassWord = await this.hashPassWord(newPass);
        let [err, result] = await to(this.InternalAccountRepository.update({ email: email }, {
            password: hashPassWord
        }))
        if (err) {
            throw new HttpException("Error Update Password", 500);
        }
        return result;
    }
    async removeCode(id: number, code) {
        let user = await this.findOne(id);
        if (!user) {
            throw new HttpException("id not found", 404);
        }
        delete user.code[code]

        let result = await this.InternalAccountRepository.update({ id }, { code: user.code })
        return true;
    }
    async updateCode(id: number, code) {
        let user = await this.findOne(id);
        if (!user) {
            throw new HttpException("id not found", 404);
        }
        user.code[code.code] = code.timeExpirate;

        let result = await this.InternalAccountRepository.update({ id }, { code: user.code })
        return true;

    }
    async findByUserName(email: string) {
        let data = await this.InternalAccountRepository.findOne({
            where: {
                email: email
            }
        })
        return data;
    }

    async activeAccount(id: number) {
        let result = await this.InternalAccountRepository.update({ id }, {
            status: ACCOUNT_STATUS.ACTIVE
        })
        console.log(result);

        return result;
    }

    async checkAccountIsActive(id: number) {
        let account = await this.findOne(id);
        if (account.status == ACCOUNT_STATUS.INACTIVE) {
            return false
        }
        return true;
    }

    async destroyAccountInactive(id: number) {
        let accountAcctive = await this.checkAccountIsActive(id);
        if (!accountAcctive) {
            await this.destroy(id);
        }
        return true;
    }

    async getListDevice(idUser: number) {
        let listDevice = await this.InternalAccountRepository.getListDevice(idUser);
        if (listDevice) {
            let keys = Object.keys(listDevice.refresh_token)
            let data = {};
            for (let key of keys) {
                data[key] = listDevice.refresh_token[key].deviceInfo;
            }
            return data
        }
        return null;
    }
}
