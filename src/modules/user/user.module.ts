import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Profile } from 'src/entity/user.entity';
import { TypeOrmModule} from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
@Module({
  imports : [
    TypeOrmModule.forFeature([Profile])
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}
