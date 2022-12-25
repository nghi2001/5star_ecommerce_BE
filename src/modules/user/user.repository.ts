import { Injectable } from "@nestjs/common";
import { DataSource, In, Repository } from 'typeorm';
import { Profile } from "../../entity/profile.entity";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable({

})
export class UserRepository extends Repository<Profile> {

    constructor(
        private dataSource: DataSource
    ) {
        super(Profile, dataSource.createEntityManager())
    }

    async createProfile(profile: CreateUserDto) {
        let result = await this.createQueryBuilder()
            .insert()
            .into(Profile)
            .values([profile])
            .execute();

        return result;
    }
    //  async findByUserName(username: string) {
    //     let user = await this.model.findOne({"account.username": username})

    //     return user
    // }

    async getList(filter = {}, pagination = {}) {
        let data = await this.find({
            where: filter,
            order: {
                id: 'ASC'
            },
            ...pagination
        })
        let total = await this.count({
            where: filter
        })
        return {
            total,
            data
        };
    }

    async getByIds(ids: number[]) {
        let data = await this.find({
            where: {
                id: In(ids)
            },
            select: {
                id: true
            }
        })
        return data;
    }
}