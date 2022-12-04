import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InternalAccountRepository } from './internalaccount.repository';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { InternalAccount } from '../../entity/internal_account.entity';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { to } from 'src/common/helper/catchError';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
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
        let result = await this.InternalAccountRepository.findAndCountAll();
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
        let result = await this.InternalAccountRepository.delete({ id });
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
}
