import { NestFactory } from '@nestjs/core';
import { MailModule } from './queue/mail/mail.module';
import { WorkerModule } from './queue/worker/worker.module';
async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);

  await app.init();
}
bootstrap();
