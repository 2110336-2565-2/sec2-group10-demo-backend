import { Controller, Post } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('mockCreateUser')
  async create(): Promise<boolean> {
    const mockUser = {
      username: 'MockMan',
      email: 'mock_man@mock.com',
      password: '123456',
    };
    await this.usersService.create(mockUser);
    return true;
  }
}
