import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/jmp');
  app.enableCors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: 'GET, POST, PUT, PATCH, DELETE',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
