import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose'
import { UserRepository } from './user.repository';
import { UserSchema } from './entities/user.entity';
import { User } from './entities/user.entity';
@Module({
  imports : [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}
