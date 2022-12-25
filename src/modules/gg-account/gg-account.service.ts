import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { GgAccountRepository } from './gg-account.repository';
import axios from 'axios';

@Injectable()
export class GgAccountService {
    constructor(
        private UserService: UserService,
        private GgAccountRepository: GgAccountRepository
    ) { }

    async verifyGbIdToken(token: string) {
        let data = await axios.get('https://www.googleapis.com/oauth2/v2/tokeninfo', {
            params: {
                id_token: token
            }
        })
        console.log(data.data);

        return data.data;
    }

    async createAccount(uid: string, name = "default", email) {
        let profile = await this.UserService.createProfile({
            first_name: name,
            email: email
        })
        let profileId = profile.raw[0].id;
        let newAccount = await this.GgAccountRepository.create({ uid: uid, id_profile: profileId }).save();
        return newAccount;
    }

    async getByUid(id: string) {
        let data = await this.GgAccountRepository.findOneBy({ uid: id });
        return data;
    }
}
