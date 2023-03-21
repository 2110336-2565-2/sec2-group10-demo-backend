import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
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
