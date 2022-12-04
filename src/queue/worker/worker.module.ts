import { Module } from '@nestjs/common';
import { BullModule } from "@nestjs/bull";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService) => ({
                redis: {
                    host: configService.get("REDIS_HOST"),
                    port: configService.get('REDIS_PORT'),
                    password: configService.get('REDIS_PASSWORD'),
                    username: configService.get('REDIS_USERNAME')
                }
            })
        }),
        MailModule
    ]
})
export class WorkerModule { }
