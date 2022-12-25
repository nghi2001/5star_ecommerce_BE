import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserService } from '../user/user.service';
import { FbAccountRepository } from './fb-account.repository';
@Injectable()
export class FbAccountService {
    constructor(
        private UserService: UserService,
        private FbAccountRepository: FbAccountRepository) {

    }
    async verifyFbToken(token: string) {
        let data = await axios.get('https://graph.facebook.com/v15.0/me', {
            params: {
                access_token: token
            }
        })
        return data.data;
    }

    async createAccount(uid: string, name = "default") {
        let profile = await this.UserService.createProfile({
            first_name: name
        })
        let profileId = profile.raw[0].id;
        let newAccount = await this.FbAccountRepository.create({ uid: uid, id_profile: profileId }).save();
        return newAccount;
    }
    async getByUid(id: string) {
        let data = await this.FbAccountRepository.findOneBy({ uid: id });
        return data;
    }
}
