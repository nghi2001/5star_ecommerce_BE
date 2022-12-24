import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { EventsGateway } from './events.gateway';
@Module({
    imports: [
        AuthModule
    ],
    providers: [EventsGateway],
    exports: [EventsGateway]
})
export class EventsModule { }
