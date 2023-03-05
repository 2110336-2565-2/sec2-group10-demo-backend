import { User, UserSchema } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/users.service';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [UsersService],
  exports: [],
})
export class RolesModule {}
