import { Module } from '@nestjs/common';
import { EventsModule } from 'src/events/events.module';
import { UserModule } from '../user/user.module';
import { NotifyController } from './notify.controller';
import { NotifyRepository } from './notify.repository';
import { NotifyService } from './notify.service';
import { NotifyUserRepository } from './notify_user.repository';

@Module({
  imports: [
    EventsModule,
    UserModule
  ],
  controllers: [NotifyController],
  providers: [NotifyService, NotifyRepository, NotifyUserRepository],
  exports: [
    NotifyService
  ]
})
export class NotifyModule { }
