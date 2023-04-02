import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaylistDto {
  @ApiProperty({ example: 'My playlist' })
  @IsNotEmpty()
  @Matches(/^(?=.{0,50}$)[a-zA-Z0-9 ]*$/)
  name: string;

  @ApiProperty({ example: 'My playlist description' })
  @IsOptional()
  @Matches(/^(?=.{0,100}$)[a-zA-Z0-9 ]*$/)
  description: string;

  @ApiProperty({ example: ['5ff4c9d8e4b0f8b8b8b8b8b8'] })
  @IsOptional()
  musics: string[];

  @ApiProperty({ example: true })
  @IsOptional()
  isAlbum: boolean;

  // @ApiProperty({
  //   type: 'string',
  //   format: 'binary',
  //   required: true,
  //   description: 'please upload image file in this field',
  // })
  // coverImage: any;
}
