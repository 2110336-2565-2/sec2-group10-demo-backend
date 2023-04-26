import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as Omise from 'omise';

import { Inject, Injectable } from '@nestjs/common';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { Role } from '../common/enums/role';
import { profilePlaceHolder } from '../constants/placeHolder';
import {
  CreateUserDto,
  UpdateUserDto,
  UpgradeToArtistDto,
} from './dto/create-user.dto';
import { ProfileDto } from './dto/profile.dto';
import { UserDto } from './dto/user.dto';
import { PlaylistsService } from './playlist/playlists.service';
import { User, UserDocument } from './schema/users.schema';

@Injectable()
export class UsersService {
  private omise: Omise.IOmise;
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(PlaylistsService)
    private readonly playlistsService: PlaylistsService,
  ) {
    this.omise = Omise({
      publicKey: process.env.OMISE_PUBLIC_KEY,
      secretKey: process.env.OMISE_SECRET_KEY,
      omiseVersion: '2019-05-29',
    });
  }

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
    Object.assign(createUserDto, {
      username: createUserDto.email,
      accountNumber:
        (await this.userModel.find().sort({ accountNumber: -1 }).limit(1))[0]
          .accountNumber + 1,
      profileImage: profilePlaceHolder,
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
      const res: UserDto = {
        userId: userUpdated._id,
        username: userUpdated.username,
        email: userUpdated.email,
        profileImage: userUpdated.profileImage,
      };
      return res;
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

  async setRoleUser(email: string, role: Role): Promise<any> {
    const user = await this.findOneByEmail(email);

    if (user.roles.includes(role)) {
      throw new ConflictException(`User already has ${role} role`);
    }

    user.roles.push(role);

    return await this.update(user._id.toString(), user);
  }

  async followArtist(followerEmail: string, id: string): Promise<any> {
    const follower = await this.findOneByEmail(followerEmail);
    const followee = await this.findOneById(id);

    if (!followee) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
    if (follower._id.toString() === followee._id.toString()) {
      throw new ConflictException(`User can't follow himself`);
    }

    if (!followee.roles.includes(Role.Artist)) {
      throw new ConflictException(`${followee.username} is not an artist`);
    }

    if (follower.following.includes(followee._id)) {
      throw new ConflictException(`User already follows ${followee.username}`);
    }

    follower.following.push(followee._id);

    await this.update(follower._id.toString(), follower);
  }

  async unfollowArtist(followerEmail: string, id: string): Promise<any> {
    const follower = await this.findOneByEmail(followerEmail);
    const followee = await this.findOneById(id);

    if (!followee) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
    if (follower._id.toString() === followee._id.toString()) {
      throw new ConflictException(`User can't unfollow himself`);
    }
    if (!followee.roles.includes(Role.Artist)) {
      throw new ConflictException(`${followee.username} is not an artist`);
    }
    if (!follower.following.includes(followee._id)) {
      throw new ConflictException(`User doesn't follow ${followee.username}`);
    }

    follower.following = follower.following.filter(
      (id) => id.toString() !== followee._id.toString(),
    );

    await this.update(follower._id.toString(), follower);
  }

  async getFollowers(id: string): Promise<UserDto[]> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
    const followersQuery = await this.userModel.aggregate([
      {
        $unwind: {
          path: '$following',
        },
      },
      {
        $match: {
          following: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          profileImage: 1,
        },
      },
    ]);
    const followers = this.queryArrayToUserDtoArray(followersQuery);

    return followers;
  }
  queryArrayToUserDtoArray(queryArray: any[]): UserDto[] {
    const userDtoArray: UserDto[] = [];
    for (const user of queryArray) {
      const userDto: UserDto = {
        userId: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      };
      userDtoArray.push(userDto);
    }
    return userDtoArray;
  }

  async getFollowing(id: string): Promise<UserDto[]> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
    const temp = [];
    for (const id of user.following) {
      temp.push(new mongoose.Types.ObjectId(id));
    }
    const followingQuery = await this.userModel.aggregate([
      {
        $match: {
          _id: {
            $in: temp,
          },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          profileImage: 1,
        },
      },
    ]);
    const following: UserDto[] = this.queryArrayToUserDtoArray(followingQuery);
    return following;
  }

  async getProfile(email: string): Promise<ProfileDto> {
    const user = await this.findOneByEmail(email);

    const follower = await this.getFollowers(user._id.toString());

    const playlist = await this.playlistsService.getPlaylistsInfo(user._id);

    const profile: ProfileDto = {
      _id: user._id.toString(),
      followerCount: follower.length,
      followingCount: user.following.length,
      roles: user.roles,
      profileImage: user.profileImage,
      username: user.username,
      playlistCount: playlist.length,
    };
    return profile;
  }

  async updateUsername(email: string, username: string): Promise<UserDto> {
    const user = await this.findOneByEmail(email);
    if (user.username === username) {
      throw new ConflictException(`Username already exists`);
    }
    user.username = username;
    const userDto: UserDto = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    };
    await this.update(user._id.toString(), user);
    return userDto;
  }

  async updateProfileImage(
    userId: mongoose.Types.ObjectId,
    profileImage: string,
  ): Promise<UserDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.profileImage = profileImage;
    const userDto: UserDto = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      profileImage: profileImage,
    };
    await this.update(user._id.toString(), user);
    return userDto;
  }

  async isFollowing(
    userId: mongoose.Types.ObjectId,
    artistId: mongoose.Types.ObjectId,
  ): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const artist = await this.userModel.findById(artistId);
    if (!artist) {
      throw new BadRequestException('Artist not found');
    }
    const followings = await this.getFollowing(userId.toString());
    const isFollowing = followings.some(function (following) {
      return new mongoose.Types.ObjectId(following.userId).equals(artistId);
    });

    return isFollowing;
  }

  async chargeCreditCard(
    userId: string,
    amount: number,
    currency: string,
    token: string,
  ) {
    return await this.omise.charges.create({
      amount: amount * 100, // amount in satang
      currency: currency,
      card: token,
      description: 'Charge for ' + userId,
    });
  }

  async updateArtistBankAccount(userId: string, data: UpgradeToArtistDto) {
    const user = await this.findOneById(userId);

    if (user.roles.includes(Role.Artist) == false) {
      throw new BadRequestException('User is not an artist');
    }

    user.accountNumber = Number(data.accountNumber);
    user.bankName = data.bankName;
    await this.update(userId, user);
  }
}
