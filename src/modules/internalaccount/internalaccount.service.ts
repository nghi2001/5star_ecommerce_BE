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
    async checkAccountNotExist(username: string, id_profile?: number) {
        let check = await this.InternalAccountRepository.findOneBy({ username });
        if (check) {
            throw new HttpException("User exist", 400);
        } return true;
    }
    async checkAccountExist(username: string) {
        let check = await this.InternalAccountRepository.findOneBy({ username });
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
        let checkProfileExist = await this.checkProfileExit(account.id_profile);
        let checkAccountNotExist = await this.checkAccountNotExist(account.username);
        if (checkProfileExist && checkAccountNotExist) {
            account.password = await this.hashPassWord(account.password);

            let result = await this.InternalAccountRepository.createAccount(account);

            return result
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
