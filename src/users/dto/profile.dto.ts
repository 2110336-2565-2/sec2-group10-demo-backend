import { IsNumber, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

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

  @ApiProperty({ example: 'www.example.com' })
  @IsString()
  profileImage: string;

  @ApiProperty({ example: 'alone' })
  @IsString()
  username: string;
}
