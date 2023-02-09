import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { Public } from './auth/public_decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
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
    name: 'username',
    type: 'string',
    required: true,
    example: 'Admin001',
  })
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user._doc);
  }

  /**
   * logout
   */
  @Post('auth/logout')
  async logout(@Request() req) {
    return this.authService.logout(req);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
