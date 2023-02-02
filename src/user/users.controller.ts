import { Controller, Post } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { CreateUserDto } from './dto/create-user.dto';

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
  @Get()
  async findAll(): Promise<CreateUserDto[]> {
    return this.usersService.findAll();
  }
}
