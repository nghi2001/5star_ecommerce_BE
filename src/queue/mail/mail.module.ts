import { Module, OnModuleInit } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
// import { AudioConsumer } from './processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'mail',
            processors: [join(__dirname, 'processor.js')]
        })
    ],
})
export class MailModule implements OnModuleInit {
    onModuleInit() {
        console.log(process.pid, '------------NGHI');

    }
}
