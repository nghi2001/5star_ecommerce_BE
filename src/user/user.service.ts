import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import mongoose from 'mongoose'
import {ObjectId} from 'mongoose'

@Injectable()
export class UserService {
    constructor(
        private UserRepository: UserRepository
    ) { }

    isInternalAccount(kind: string): boolean {
        if (kind == 'internal') {
            return true
        }
        return false
    }

    async hashPassWord(password: string): Promise<string> {
        let salt = await bcrypt.genSalt();
        let hashPass = await bcrypt.hash(password, salt);
        return hashPass
    }
    async createUser(createUserDto: CreateUserDto) {

        if (this.isInternalAccount(createUserDto.account.kind)) {
            createUserDto.account.password = await this.hashPassWord(createUserDto.account.password)
        }
        let result = await this.UserRepository.create({
            email: createUserDto.email,
            first_name: createUserDto.first_name,
            last_name: createUserDto.last_name,
            phone: createUserDto.phone,
            gender: createUserDto.gender,
            address: [...createUserDto.address],
            account: createUserDto.account
        })

        return result
    }

    checkObjectId(id: string): boolean{
        let ObjectId = mongoose.Types.ObjectId;
        if(ObjectId.isValid(id)){
            return true
        }

        throw new HttpException('id invalid', HttpStatus.NOT_ACCEPTABLE)
    }
    async deleteUser(id:mongoose.Types.ObjectId) {
        let result = await this.UserRepository.delete(id);
        return result
    }

    async findOne(id: mongoose.Types.ObjectId) {
        let user = await this.UserRepository.findById(id);
        return user
    }
}
