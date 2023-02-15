import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './schema/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    // Set email to lowercase
    createUserDto.email = createUserDto.email.toLowerCase();

    const user = await this.userModel.findOne({
      email: createUserDto.email.toLowerCase(),
    });
    if (user) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const password = createUserDto.password;
    createUserDto.password = await bcrypt.hash(password, salt);

    // Attach username to createUserDto
    Object.assign(createUserDto, { username: createUserDto.email });

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOneById(id: string, projection = {}): Promise<UserDto> {
    try {
      const user = await this.userModel.findById(id, projection);
      const userDto = new UserDto();
      userDto.username = user.username;
      userDto.email = user.email;
      return userDto;
    } catch (e) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
  }

  async findOneByUsername(username: string, projection = {}): Promise<User> {
    return this.userModel.findOne(
      { username: username.toLowerCase() },
      projection,
    );
  }

  async findOneByEmail(email: string, projection = {}): Promise<User> {
    return this.userModel.findOne({ email: email.toLowerCase() }, projection);
  }

  async update(id: string, user: UpdateUserDto): Promise<UserDto> {
    const userCheck = await this.findOneByUsername(user.username);
    if (userCheck && userCheck._id.toString() != id) {
      throw new ConflictException(
        `User with name ${user.username} already exists`,
      );
    }
    const emailCheck = await this.userModel.findOne({
      email: user.email.toLowerCase(),
    });
    if (emailCheck && emailCheck._id.toString() != id) {
      throw new ConflictException(`Email ${user.email} already exists`);
    }
    try {
      const userUpdated = await this.userModel.findByIdAndUpdate(id, user, {
        new: true,
      });
      return userUpdated;
    } catch (err) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
  }

  async delete(id: string): Promise<UserDto> {
    try {
      const userDeleted = await this.userModel.findByIdAndDelete(id);
      return new UserDto();
    } catch (err) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
  }
}
