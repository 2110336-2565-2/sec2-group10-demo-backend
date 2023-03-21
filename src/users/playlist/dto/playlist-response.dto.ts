import { Types } from 'mongoose';

import { ApiProperty, PickType } from '@nestjs/swagger';

import { Playlist } from '../../schema/playlist.schema';

export class GetPlaylistInfoResponseDto extends PickType(Playlist, [
  '_id',
  'name',
  'description',
  'coverImage',
  'isAlbum',
] as const) {
  /**
   * username of the owner
   * @example 'user1'
   */
  @ApiProperty({ example: 'user1' })
  creatorName: string;

  /**
   * Id of the owner
   * @example '5ff4c9d8e4b0f8b8b8b8b8b8'
   */
  @ApiProperty({ example: '5ff4c9d8e4b0f8b8b8b8b8b8' })
  creatorId: Types.ObjectId;
}

export class UpdatePlaylistInfoResponseDto extends PickType(Playlist, [
  'name',
  'description',
  'coverImage',
] as const) {}

export class DeletePlaylistResponseDto extends PickType(Playlist, [
  'name',
  'description',
  'coverImage',
] as const) {}

export class CreatePlaylistResponseDto extends PickType(Playlist, [
  '_id',
  'name',
  'description',
  'coverImage',
  'musics',
] as const) {}
