import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'

@Schema()
class InternalAccount {
    @Prop({ default: "internal" })
    kind?: string
    @Prop()
    username: string
    @Prop()
    password: string

}

let InternalAccountSchema = SchemaFactory.createForClass(InternalAccount)
@Schema()
class GoogleAccount {
    @Prop({default: "google"})
    kind?: string
    @Prop()
    uid: string
    
}
let GoogleAccountSchema = SchemaFactory.createForClass(GoogleAccount)

@Schema()
export class User {
    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    first_name: string

    @Prop({ required: true })
    last_name: string

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    gender: string;

    @Prop([String])
    address: string[];

    @Prop({type: InternalAccountSchema || GoogleAccountSchema})
    account: InternalAccount | GoogleAccount


}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);