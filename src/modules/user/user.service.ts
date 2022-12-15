import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDTO } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        private UserRepository: UserRepository,
        private FileService: FileService
    ) { }

    isInternalAccount(kind: string): boolean {
        if (kind == 'internal') {
            return true
        }
        return false
    }

    async renderCondition(query) {
        let {
            id,
            first_name,
            last_name,
            email,
            is_active
        } = query;
        let condition: any = {};
        if (id) {
            condition.id = id;
        }
        if (first_name) {
            condition.first_name = first_name;
        }
        if (last_name) {
            condition.last_name = last_name;
        }
        if (email) {
            condition.email = email;
        }
        if (is_active) {
            condition.is_active = is_active;
        }
        return condition
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

    async getAllUser(filter, pagination) {
        let data = await this.UserRepository.getList(filter, pagination);
        return data
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
        if (update.avatar_id) {
            let check = await this.FileService.checkExits(update.avatar_id)
            if (!check) {
                throw new HttpException("avatar_id not found", 404);
            }
        }
        let data = await this.UserRepository.update({ id }, update)
        return data
    }
}
