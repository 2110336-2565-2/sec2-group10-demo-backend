import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { Public } from './auth/public_decorator';
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
}
