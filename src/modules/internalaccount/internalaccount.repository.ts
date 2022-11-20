import { HttpException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InternalAccount } from '../../entity/internal_account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class InternalAccountRepository extends Repository<InternalAccount> {
    constructor(
        private dataSource: DataSource
    ) {
        super(InternalAccount, dataSource.createEntityManager());
    }

    async findAndCountAll() {
        let result = await this.findAndCount({
            relations: {
                profile: true
            }
        });
        return result
    }

    async createAccount(account: CreateAccountDto) {
        let newAccount = await this.createQueryBuilder()
            .insert()
            .into(InternalAccount)
            .values([account])
            .execute()

        return newAccount
    }
}