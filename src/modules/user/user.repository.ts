import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from "./entities/user.entity";
import { Model } from 'mongoose'
import { BaseRepository } from "src/common/base/BaseRepository";

@Injectable({
    
})
export class UserRepository extends BaseRepository<User> {

    constructor(
        @InjectModel(User.name) UserModel: Model<User>
    ){
        super(UserModel)
    }
     helo() {
        return 'Hello'
     }
     async findByUserName(username: string) {
        let user = await this.model.findOne({"account.username": username})
        
        return user
    }
}