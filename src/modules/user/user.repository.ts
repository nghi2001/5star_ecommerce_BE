import { Injectable } from "@nestjs/common";
import { DataSource,Repository } from 'typeorm';
import { Profile } from "src/entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable({
    
})
export class UserRepository extends Repository<Profile> {

    constructor(
        private dataSource: DataSource
    ){
        super(Profile, dataSource.createEntityManager())
    }

    async createProfile (profile: CreateUserDto) {
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
}