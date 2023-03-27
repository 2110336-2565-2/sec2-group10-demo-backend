import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from 'src/common/enums/role';

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

  async create(
    createUserDto: CreateUserDto,
    profileImage: string,
  ): Promise<CreateUserDto> {
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
    Object.assign(createUserDto, {
      username: createUserDto.email,
      profileImage: profileImage,
    });

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOneById(id: string, projection = {}): Promise<User> {
    try {
      const user = await this.userModel.findById(id, projection);
      if (!user) {
        throw new NotFoundException(`There isn't any user with id: ${id}`);
      }

      return user;
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

  async setRoleUser(email: string, role: Role, update_data: any): Promise<any> {
    const user = await this.findOneByEmail(email);

    if (user.roles.includes(role)) {
      throw new ConflictException(`User already has ${role} role`);
    }
    user.roles.push(role);
    if (role === Role.Artist) {
      user.accountNumber = update_data.accountNumber;
      user.bankName = update_data.bankName;
    }

    return await this.update(user._id.toString(), user);
  }

  async followArtist(
    followerEmail: string,
    followeename: string,
  ): Promise<any> {
    const follower = await this.findOneByEmail(followerEmail);
    const followee = await this.findOneByUsername(followeename);

    if (!followee) {
      throw new NotFoundException(
        `There isn't any user with username: ${followeename}`,
      );
    }
    if (!followee.roles.includes(Role.Artist)) {
      throw new ConflictException(`${followeename} is not an artist`);
    }
    if (follower.following.includes(followee._id)) {
      throw new ConflictException(`User already follows ${followeename}`);
    }
    follower.following.push(followee._id);

    await this.update(follower._id.toString(), follower);
  }

  async unfollowArtist(
    followerEmail: string,
    followeename: string,
  ): Promise<any> {
    const follower = await this.findOneByEmail(followerEmail);
    const followee = await this.findOneByUsername(followeename);

    if (!followee) {
      throw new NotFoundException(
        `There isn't any user with username: ${followeename}`,
      );
    }
    if (!followee.roles.includes(Role.Artist)) {
      throw new ConflictException(`${followeename} is not an artist`);
    }
    if (!follower.following.includes(followee._id)) {
      throw new ConflictException(`User doesn't follow ${followeename}`);
    }
    follower.following = follower.following.filter(
      (id) => id.toString() !== followee._id.toString(),
    );

    await this.update(follower._id.toString(), follower);
  }
}
