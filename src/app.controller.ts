import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { Public } from './auth/public_decorator';
import { Role } from './common/enums/role';
import {
  UpgradeToArtistDto,
  UpgradeToPremiumDto,
} from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * login
   */
  @ApiResponse({ status: 201, description: 'return access token' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiQuery({
    name: 'password',
    type: 'string',
    required: true,
    example: '001Admin',
  })
  @ApiQuery({
    name: 'email',
    type: 'string',
    required: true,
    example: '123456@gmail.com',
  })
  @Post('auth/login')
  async login(@Request() req) {
    const query_user = await this.userService.findOneByEmail(req.user.email);

    const req_user = {
      _id: query_user._id,
      username: query_user.username,
      email: query_user.email,
      roles: query_user.roles,
    };
    return await this.authService.login(req_user);
  }

  /**
   * logout
   */
  @ApiBearerAuth()
  @Post('auth/logout')
  async logout(@Request() req) {
    return this.authService.logout(req);
  }
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  //set role artist
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Return access token',
  })
  @ApiConflictResponse({ description: 'User already has artist role' })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.CONFLICT)
  @Put('role/artist')
  async upgradeToArtist(@Request() req, @Body() body: UpgradeToArtistDto) {
    const new_role_user = await this.userService.setRoleUser(
      req.user.email,
      Role.Artist,
      body,
    );
    const req_user = {
      _id: new_role_user._id,
      username: new_role_user.username,
      email: new_role_user.email,
      roles: new_role_user.roles,
    };
    return await this.authService.login(req_user);
  }

  //set role premium
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Return access token',
  })
  @ApiConflictResponse({ description: 'User already has premium role' })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.CONFLICT)
  @Put('role/premium')
  async upgradeToPremium(@Request() req, @Body() body: UpgradeToPremiumDto) {
    const new_role_user = await this.userService.setRoleUser(
      req.user.email,
      Role.Premium,
      body,
    );
    const req_user = {
      _id: new_role_user._id,
      username: new_role_user.username,
      email: new_role_user.email,
      roles: new_role_user.roles,
    };
    return await this.authService.login(req_user);
  }
}
