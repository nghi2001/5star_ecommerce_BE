import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TranformInterceptor } from './Interceptors/tranform.interceptor';
import * as cookieParser from 'cookie-parser';
import * as origin from './config/origin/config.json';
import * as Fingerprint from 'express-fingerprint';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(Fingerprint({
    parameters: [
      // Defaults
      Fingerprint.useragent,
      Fingerprint.acceptHeaders,
      Fingerprint.geoip,
    ]
  }))
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
  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
