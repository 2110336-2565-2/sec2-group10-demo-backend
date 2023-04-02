import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '5f9f1c5b9b9b9b1b1b1b1b1b' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: 'sernhiwkhao' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'sernhiwkhao@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example:
      'https://storage.googleapis.com/demo-tuder-music/coverImage/1679409670439.jpg',
  })
  @IsNotEmpty()
  @IsString()
  profileImage: string;
}
