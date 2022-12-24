import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactRepository } from './contact.repository';
import { ContactService } from './contact.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: "mail"
    }),
  ],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository]
})
export class ContactModule { }
