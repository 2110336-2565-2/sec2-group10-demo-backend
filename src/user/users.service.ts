import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    //const password = createUserDto.password;
    //createUserDto.password = await bcrypt.hash(password, saltOrRounds);

    //make email and username insensitivecase
    createUserDto.email = createUserDto.email.toLowerCase();
    createUserDto.username = createUserDto.username.toLowerCase();

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(filter: any, projection = {}): Promise<User | undefined> {
    return await this.userModel.findOne(filter, projection);
  }

  async findOneUsername(
    username: string,
    projection = {},
  ): Promise<User | undefined> {
    return await this.findOne({ username: username.toLowerCase() }, projection);
  }
}
