import { Injectable } from '@nestjs/common';
import { UserDocument } from './schema/user.schema';
import { UserRepository } from './user.repository';
// import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        private UserRepository: UserRepository
    ){}
    async Hello() {
        let data = await this.UserRepository.find({})
        return data
    }

    async add() {
        let data = await this.UserRepository.create(({
            username: "nghi",
            age: 12,
            email: 'nghi',
            gender: 1
        }) as UserDocument)
        return data
    }
}
