import { Response } from "express";
import MulterGoogleCloudStorage from "multer-cloud-storage";
import { FileMetadata } from "src/cloudStorage/googleCloud.interface";
import {
  STORAGE_OPTIONS,
  uploadLimits,
  uploadMusicImageFilter
} from "src/cloudStorage/googleCloud.utils";
import { Role } from "src/common/enums/role";
import { Roles } from "src/roles/roles.decorator";

import {
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { Body, HttpCode, Req, Res } from "@nestjs/common/decorators";
import {
  Delete,
  Get,
  Put
} from "@nestjs/common/decorators/http/request-mapping.decorator";
import { HttpStatus } from "@nestjs/common/enums";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags
} from "@nestjs/swagger";

import { Public } from "../auth/public_decorator";
import {
  CreateUserDto,
  UpdateUserDto,
  UpgradeToArtistDto,
  UpgradeToPremiumDto
} from "./dto/create-user.dto";
import { ProfileDto } from "./dto/profile.dto";
import { UserDto } from "./dto/user.dto";
import { User } from "./schema/users.schema";
import { UsersService } from "./users.service";

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profileImage', maxCount: 1 }], {
      storage: new MulterGoogleCloudStorage(STORAGE_OPTIONS),
      fileFilter: uploadMusicImageFilter,
      limits: uploadLimits,
    }),
  )
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.NOT_FOUND)
  @HttpCode(HttpStatus.CONFLICT)
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles()
    files: { profileImage: FileMetadata[] },
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.usersService.create(
      createUserDto,
      files.profileImage[0].linkUrl,
    );
    return res.json({
      email: user.email,
      message: 'User created successfully',
      profileImage: files.profileImage[0].linkUrl,
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

  @ApiParam({ name: 'username' })
  @ApiOkResponse({
    description: 'Return user',
    type: User,
  })
  @Get('user/:username')
  @HttpCode(HttpStatus.OK)
  async findByUsername(@Param() params) {
    return this.usersService.findOneByUsername(params.username);
  }

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
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Success to upgrade to artist',
  })
  @ApiConflictResponse({ description: 'User already has artist role' })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.CONFLICT)
  @Put('role/artist')
  async upgradeToArtist(@Req() req, @Body() body: UpgradeToArtistDto) {
    await this.usersService.setRoleUser(req.user.email, Role.Artist, body);

    return { message: 'success to upgrade to artist', success: true };
  }

  //set role premium
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Success to upgrade to premium',
  })
  @ApiConflictResponse({ description: 'User already has premium role' })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.CONFLICT)
  @Put('role/premium')
  async upgradeToPremium(@Req() req, @Body() body: UpgradeToPremiumDto) {
    // console.log(req);
    await this.usersService.setRoleUser(req.user.email, Role.Premium, body);

    return { message: 'success to upgrade to premium', success: true };
  }

  //mock get profile

  @ApiOkResponse({
    description: 'Return user profile',
  })
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getUserProfile(@Req() req): Promise<ProfileDto> {
    const user = await this.usersService.findOneByEmail(req.user.email);
    const profile: ProfileDto = new ProfileDto();
    profile.followerCount = user.followers.length;
    profile.followingCount = user.following.length;
    profile.playlistCount = 999;
    profile.username = user.username;
    profile.profileImage = user.profileImage;
    return profile;
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'return role',
  })
  @Get('role')
  @HttpCode(HttpStatus.OK)
  async getRole(@Req() req) {
    const user = await this.usersService.findOneByEmail(req.user.email);
    return user.roles;
  }
}
