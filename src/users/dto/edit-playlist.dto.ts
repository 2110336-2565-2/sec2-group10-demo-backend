import { IsOptional, IsString, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class EditPlaylistDto {
  @ApiProperty({ example: 'My playlist' })
  @IsOptional()
  @Matches(/^(?=.{0,50}$)[a-zA-Z0-9 ]*$/)
  name: string;

  @ApiProperty({ example: 'My playlist description' })
  @IsOptional()
  @Matches(/^(?=.{0,100}$)[a-zA-Z0-9 ]*$/)
  description: string;

  @ApiProperty({ example: 'https://i.imgur.com/1J2h9YR.jpg' })
  @IsOptional()
  @IsString()
  coverImage: string;
}
