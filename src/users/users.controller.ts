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

import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './schema/users.schema';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: 'Return users',
    type: [User],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<CreateUserDto[]> {
    return this.usersService.findAll();
  }

  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({
    description: 'Return user',
    type: UserDto,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param() params) {
    return this.usersService.findOneById(params.id);
  }

  @ApiCreatedResponse({
    description: 'Return created user',
    type: UserDto,
  })
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

  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Return deleted user',
    type: Object,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param() params) {
    return this.usersService.delete(params.id);
  }

  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Return updated user',
    type: UserDto,
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param() params, @Body() user: CreateUserDto) {
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
    return this.usersService.findByUsername(params.username);
  }
}
