import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { GgAccountRepository } from './gg-account.repository';
import axios from 'axios';
import * as zlib from 'zlib';
import { to } from 'src/common/helper/catchError';
@Injectable()
export class GgAccountService {
    constructor(
        private UserService: UserService,
        private GgAccountRepository: GgAccountRepository
    ) { }

    async verifyGbIdToken(token: string) {
        let data = await axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo', {
            params: {
                id_token: token
            },
            responseType: 'arraybuffer',
            'decompress': true
        })
        let [err, userInfo] = await to(new Promise((resolve, reject) => {
            zlib.gunzip(data.data, function (err, output) {
                if (err) {
                    reject(err)
                }
                resolve(JSON.parse(output.toString()))
            })
        }))
        if (err) {
            console.log("Err GG Get User Info", err.message);
            throw new HttpException("Get User Info", 500);
        }
        return userInfo;
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
