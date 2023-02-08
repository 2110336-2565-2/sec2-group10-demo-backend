import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusicsModule } from './music/musics.module';
import { UsersModule } from './user/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URI: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    UsersModule,
    MusicsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
