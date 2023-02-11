import { Response } from 'express';

import { Controller, Param, Post } from '@nestjs/common';
import { Body, HttpCode, Res } from '@nestjs/common/decorators';
import {
  Delete,
  Get,
  Put,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { HttpStatus } from '@nestjs/common/enums';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '../auth/public_decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: 'Return users',
    type: [CreateUserDto],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<CreateUserDto[]> {
    return this.usersService.findAll();
  }

  @ApiParam({ name: 'id', type: String, required: true })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param() params) {
    return this.usersService.findOneById(params.id);
  }

  @ApiCreatedResponse({
    description: 'User created successfully',
    type: CreateUserDto,
  })
  @Post()
  @Public()
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

  @ApiParam({ name: 'id' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param() params) {
    return this.usersService.delete(params.id);
  }

  @ApiParam({ name: 'id' })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param() params, @Body() user: CreateUserDto) {
    return this.usersService.update(params.id, user);
  }

  @ApiParam({ name: 'username' })
  @Get('user/:username')
  @HttpCode(HttpStatus.OK)
  async findByUsername(@Param() params) {
    return this.usersService.findOneByUsername(params.username);
  }
}
