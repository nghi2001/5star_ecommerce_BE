import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TranformInterceptor } from './Interceptors/tranform.interceptor';
import * as cookieParser from 'cookie-parser';
import * as origin from './config/origin/config.json';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(origin.origin);

  app.use(cookieParser());
  app.enableCors({
    origin: origin.origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // use global interceptor 
  app.useGlobalInterceptors(new TranformInterceptor());
  const config = new DocumentBuilder()
    .setTitle("Document API")
    .setDescription("Document Api 5star ecommerce")
    .setVersion('1.0')
    .addTag("Cats")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
