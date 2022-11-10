import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TranformInterceptor } from './Interceptors/tranform.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  // use global interceptor 
  app.useGlobalInterceptors(new TranformInterceptor());

  const config = new DocumentBuilder()
    .setTitle("Document API")
    .setDescription("Document Api 5star ecommerce")
    .setVersion('1.0')
    .addTag("Cats")
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api',app,document);
  await app.listen(3000);
}
bootstrap();
