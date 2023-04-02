import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlaylistImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'please upload image file in this field',
  })
  coverImage: any;

  @ApiProperty({
    example: '6401f35af8e60e217902722c',
    description: 'id of playlist to edit image',
  })
  @IsNotEmpty()
  @IsString()
  playlistId: string;
}
