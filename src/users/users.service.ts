import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(username: string): Promise<User> {
    const createdUser = new this.userModel({ name: username });
    return createdUser.save();
  }
}
