import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import mongoose from 'mongoose'
import { ObjectId } from 'mongoose'
import { Profile } from '../../entity/profile.entity';

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

    async createUser(createUserDto: CreateUserDto) {

        let result = await this.UserRepository.createProfile({
            email: createUserDto.email,
            first_name: createUserDto.first_name,
            last_name: createUserDto.last_name,
            phone: createUserDto.phone,
            gender: createUserDto.gender,
            address: [...createUserDto.address]
        });

        return result;
    }
    async createProfile(createUserDto: CreateUserDto) {

        let result = await this.UserRepository.createProfile({
            email: createUserDto.email,
            first_name: createUserDto.first_name,
            last_name: createUserDto.last_name,
            phone: createUserDto.phone,
            gender: createUserDto.gender,
        });

        return result;
    }
    checkObjectId(id: number): boolean {
        if (Number(id) && id > 0) {
            return true
        }

        throw new HttpException('id invalid', HttpStatus.NOT_ACCEPTABLE)
    }
    async deleteUser(id: number) {
        let result = await this.UserRepository.delete({ id });
        return result
    }

    async findOne(id: number) {
        let user = await this.UserRepository.findOne({
            where: {
                id: id
            },
            relations: {
                avatar: true
            }
        });
        return user
    }

    async getAllUser() {
        let [users, count] = await this.UserRepository.findAndCount();
        return [users, count]
    }


    async checkUserExist(username: string) {
        // let user = await this.UserRepository.findByUserName(username)
        // if (user) {
        //     return user;
        // }
        // throw new HttpException("user not exist", HttpStatus.NOT_FOUND)
        return true
    }
    async update(id, update) {
        let data = await this.UserRepository.update({ id }, update)
        return data
    }
}
