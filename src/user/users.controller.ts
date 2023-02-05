import { Controller, Param, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
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
  async getUsers(): Promise<CreateUserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getUser(@Param() params) {
    return this.usersService.findById(params.id);
  }

  @Post()
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
}
