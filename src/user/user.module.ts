import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose'
import { UserRepository } from './user.repository';
import { UserSchema } from './schema/user.schema';
import { User } from './schema/user.schema';
@Module({
  imports : [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository]
})
export class UserModule {}
