import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from "./schema/user.schema";
import { Model } from 'mongoose'
import { BaseRepository } from "src/common/base/BaseRepository";


@Injectable({
    
})
export class UserRepository extends BaseRepository<UserDocument> {

    constructor(
        @InjectModel(User.name) UserModel: Model<UserDocument>
    ){
        super(UserModel)
    }
     helo() {
        return 'Hello'
     }
}