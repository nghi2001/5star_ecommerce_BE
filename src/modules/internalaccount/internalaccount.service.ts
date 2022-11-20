import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InternalAccountRepository } from './internalaccount.repository';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { InternalAccount } from '../../entity/internal_account.entity';
@Injectable()
export class InternalaccountService {
    constructor(
        private UserService: UserService,
        private InternalAccountRepository: InternalAccountRepository
    ) { }

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

}
