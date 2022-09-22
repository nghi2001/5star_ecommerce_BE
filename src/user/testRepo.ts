import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/common/base/BaseRepository";
import { UserDocument } from "./schema/user.schema";
import { InjectModel } from '@nestjs/mongoose';
import { User } from "./schema/user.schema";
import { Model } from "mongoose"
@Injectable()
export class Test extends BaseRepository<UserDocument> {
    constructor(
        @InjectModel(User.name) private UserRepo: Model<UserDocument>
    ){
        super(UserRepo)
    }
}