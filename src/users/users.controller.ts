import { Response } from 'express';

import { Controller, Param, Post } from '@nestjs/common';
import { Body, HttpCode, Res } from '@nestjs/common/decorators';
import {
  Delete,
  Get,
  Put,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { HttpStatus } from '@nestjs/common/enums';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('mockCreateUser')
  @HttpCode(HttpStatus.CREATED)
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
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<CreateUserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param() params) {
    return this.usersService.findById(params.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.usersService.create(createUserDto);
    return res.json({
      username: user.username,
      email: user.email,
      message: 'User created successfully',
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param() params) {
    return this.usersService.delete(params.id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param() params, @Body() user: CreateUserDto) {
    return this.usersService.update(params.id, user);
  }

  @Get('user/:username')
  @HttpCode(HttpStatus.OK)
  async findByUsername(@Param() params) {
    return this.usersService.findByUsername(params.username);
  }
}
