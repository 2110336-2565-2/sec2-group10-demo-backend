import { IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({ example: 50 })
  @IsNumber()
  followerCount: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  followingCount: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  playlistCount: number;
}
