import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { ApiProperty, PickType } from '@nestjs/swagger';

import { Playlist } from '../../schema/playlist.schema';

export class AddMusicToPlaylistResponseDto extends PickType(Playlist, [
  'name',
  'description',
  'coverImage',
  'musics',
] as const) {}

export class AddMusicToPlaylistBodyDto {
  /**
   * List of music ids
   * @example ['5ff4c9d8e4b0f8b8b8b8b8b8', '5ff4c9d8e4b0f8b8b8b8b8b9']
   */
  @ApiProperty({
    example: ['5ff4c9d8e4b0f8b8b8b8b8b8', '5ff4c9d8e4b0f8b8b8b8b8b9'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  musicIds: Types.ObjectId[];
}
