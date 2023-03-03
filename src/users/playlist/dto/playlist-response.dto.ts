import { PickType } from '@nestjs/swagger';

import { Playlist } from '../../schema/playlist.schema';

export class GetPlaylistInfoResponseDto extends PickType(Playlist, [
  '_id',
  'name',
  'description',
  'coverImage',
] as const) {}

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
