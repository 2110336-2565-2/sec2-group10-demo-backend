import { Response } from 'express';
import { Types } from 'mongoose';
import MulterGoogleCloudStorage from 'multer-cloud-storage';
import { type } from 'os';
import { FileMetadata } from 'src/cloudStorage/googleCloud.interface';
import {
  STORAGE_OPTIONS,
  uploadLimits,
  uploadMusicImageFilter,
} from 'src/cloudStorage/googleCloud.utils';
import { Role } from 'src/common/enums/role';
import { profilePlaceHolder } from 'src/constants/placeHolder';
import { UPGRADE_PREMIUM_PRICE } from 'src/constants/user';
import { Roles } from 'src/roles/roles.decorator';

import { Controller, Param, Post } from '@nestjs/common';
import {
  Body,
  HttpCode,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common/decorators';
import {
  Delete,
  Get,
  Patch,
  Put,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { HttpStatus } from '@nestjs/common/enums';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Public } from '../auth/public_decorator';
import {
  CreateUserDto,
  UpdateUserDto,
  UpgradeToArtistDto,
  UpgradeToPremiumDto,
} from './dto/create-user.dto';
import { ProfileDto } from './dto/profile.dto';
import { ResponseDto } from './dto/response.dto';
import { UpdateProfileImageDto } from './dto/update-profile-image.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UserDto } from './dto/user.dto';
import { PlaylistsService } from './playlist/playlists.service';
import { User } from './schema/users.schema';
import { UsersService } from './users.service';
import { UPGRADE_PREMIUM_PRICE } from 'src/constants/user';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly playlistsService: PlaylistsService,
  ) {}

  @Roles(Role.User)
  @ApiOkResponse({
    description: 'Return users',
    type: [User],
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<CreateUserDto[]> {
    return this.usersService.findAll();
  }

  @Roles(Role.Artist)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({
    description: 'Return user',
    type: User,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  async getUser(@Param() params) {
    return this.usersService.findOneById(params.id);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'Return created user',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiConflictResponse({
    description: 'Email already exists',
  })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.NOT_FOUND)
  @HttpCode(HttpStatus.CONFLICT)
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.usersService.create(createUserDto);
    return res.json({
      email: user.email,
      message: 'User created successfully',
      profileImage: profilePlaceHolder,
    });
  }

  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Return deleted user',
    type: Object,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  async deleteUser(@Param() params) {
    return this.usersService.delete(params.id);
  }

  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'Return updated user',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiConflictResponse({
    description: 'Email or Username already exists',
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @HttpCode(HttpStatus.CONFLICT)
  async updateUser(@Param() params, @Body() user: UpdateUserDto) {
    return this.usersService.update(params.id, user);
  }

  // @ApiParam({ name: 'username' })
  // @ApiOkResponse({
  //   description: 'Return user',
  //   type: User,
  // })
  // @Get('user/:username')
  // @HttpCode(HttpStatus.OK)
  // async findByUsername(@Param() params) {
  //   return this.usersService.findOneByUsername(params.username);
  // }

  @ApiParam({ name: 'email' })
  @ApiOkResponse({
    description: 'Return user',
    type: User,
  })
  @Get('email/:email')
  @HttpCode(HttpStatus.OK)
  async findByEmail(@Param() params) {
    return this.usersService.findOneByEmail(params.email);
  }

  //set role artist

  @ApiOkResponse({
    description: 'Success to upgrade to artist',
  })
  @ApiConflictResponse({ description: 'User already has artist role' })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.CONFLICT)
  @Put('role/artist')
  async upgradeToArtist(@Req() req, @Body() body: UpgradeToArtistDto) {
    await this.usersService.setRoleUser(req.user.email, Role.Artist);
    await this.usersService.updateArtistBankAccount(req.user.userId, body);

    return { message: 'success to upgrade to artist', success: true };
  }

  //set role premium

  @ApiOkResponse({
    description: 'Success to upgrade to premium',
  })
  @ApiConflictResponse({ description: 'User already has premium role' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    description: 'Cannot make a payment',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.CONFLICT)
  @HttpCode(HttpStatus.UNAUTHORIZED)
  @HttpCode(HttpStatus.NOT_FOUND)
  @HttpCode(HttpStatus.BAD_REQUEST)
  @HttpCode(HttpStatus.FORBIDDEN)
  @Put('role/premium')
  async upgradeToPremium(@Req() req, @Body() body: UpgradeToPremiumDto) {
    const result = await this.usersService.chargeCreditCard(
      req.user.userId,
      UPGRADE_PREMIUM_PRICE,
      'thb',
      body.token,
    );

    if (result.failure_code) {
      return { message: 'cannot make a payment', success: false };
    }

    await this.usersService.setRoleUser(req.user.email, Role.Premium);

    return { message: 'success to upgrade to premium', success: true };
  }

  @ApiOkResponse({
    description: 'Return user profile',
    type: ProfileDto,
  })
  @Get('profile/me')
  @HttpCode(HttpStatus.OK)
  async getMyProfile(@Req() req): Promise<ProfileDto> {
    const profile = await this.usersService.getProfile(req.user.email);
    return profile;
  }

  @ApiOkResponse({
    description: 'Return specific user profile',
    type: ProfileDto,
  })
  @Get('profile/:id')
  @ApiParam({ name: 'id' })
  @HttpCode(HttpStatus.OK)
  async getUserProfile(@Param() param): Promise<ProfileDto> {
    const user = await this.usersService.findOneById(param.id);
    const profile = await this.usersService.getProfile(user.email);
    return profile;
  }

  @ApiOkResponse({
    description: 'return role',
  })
  @Get('role')
  @HttpCode(HttpStatus.OK)
  async getRole(@Req() req) {
    const user = await this.usersService.findOneByEmail(req.user.email);
    return user.roles;
  }

  @ApiOkResponse({
    description: 'Success to follow user',
    type: ResponseDto,
  })
  @ApiParam({ name: 'id' })
  @Put('follow/:id')
  @HttpCode(HttpStatus.OK)
  async followArtist(@Req() req, @Param() params) {
    await this.usersService.followArtist(req.user.email, params.id);
    const response: ResponseDto = {
      message: 'success to follow user',
      success: true,
    };
    return response;
  }

  @ApiOkResponse({
    description: 'Success to unfollow user',
    type: ResponseDto,
  })
  @ApiParam({ name: 'id' })
  @Put('unfollow/:id')
  @HttpCode(HttpStatus.OK)
  async unfollowArtist(@Req() req, @Param() params) {
    await this.usersService.unfollowArtist(req.user.email, params.id);
    const response: ResponseDto = {
      message: 'success to unfollow user',
      success: true,
    };
    return response;
  }

  @ApiOkResponse({
    description: 'Return list of followers',
    type: [UserDto],
  })
  @ApiParam({ name: 'id' })
  @Get('follower/:id')
  @HttpCode(HttpStatus.OK)
  async getFollowers(@Param() params) {
    return await this.usersService.getFollowers(params.id);
  }

  @ApiOkResponse({
    description: 'Return list of following',
    type: [UserDto],
  })
  @ApiParam({ name: 'id' })
  @Get('following/:id')
  @HttpCode(HttpStatus.OK)
  async getFollowing(@Param() params) {
    return await this.usersService.getFollowing(params.id);
  }

  @ApiOkResponse({
    description: 'Success to update username',
    type: UserDto,
  })
  @ApiBody({ type: UpdateUsernameDto })
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateMyUsername(
    @Req() req,
    @Body()
    body: {
      username?: string;
    },
  ) {
    const user = await this.usersService.updateUsername(
      req.user.email,
      body.username,
    );

    return user;
  }

  @ApiOkResponse({
    description: 'Success to update username',
    type: UserDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileImageDto })
  @Patch('profile/image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profileImage', maxCount: 1 }], {
      storage: new MulterGoogleCloudStorage(STORAGE_OPTIONS),
      fileFilter: uploadMusicImageFilter,
      limits: uploadLimits,
    }),
  )
  async updateProfileImage(
    @Req() req,
    @UploadedFiles() files: { profileImage: FileMetadata[] },
  ) {
    const user = await this.usersService.updateProfileImage(
      req.user.userId,
      files.profileImage[0].linkUrl,
    );

    return user;
  }

  @ApiResponse({
    status: 200,
    description: 'Returns a boolean indicating success',
    schema: {
      type: 'boolean',
      example: true,
    },
  })
  @ApiQuery({
    name: 'artistId',
    description: 'Artist Id to check if logged in user already follow',
    type: String,
    required: true,
    example: '6429ae3fda8fc503c5f3bf37',
  })
  @Get('isFollowing')
  async isFollowing(@Req() req, @Query('artistId') artistId: string) {
    const isFollowing = await this.usersService.isFollowing(
      req.user.userId,
      new Types.ObjectId(artistId),
    );
    return isFollowing;
  }
}
