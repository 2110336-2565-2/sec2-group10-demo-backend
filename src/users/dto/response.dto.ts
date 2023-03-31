import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({ example: 'success to unfollow user' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsEmail()
  success: boolean;
}
