import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger/dist';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from './app.module';

export const createApp = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  const config = new DocumentBuilder()
    .setTitle('Demo API')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  return app;
};
