import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'

@Schema({
    timestamps: true
})
export class User {
    @Prop()
    username: string
    @Prop()
    age: number
    @Prop()
    email: string
    @Prop()
    gender: number

}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);