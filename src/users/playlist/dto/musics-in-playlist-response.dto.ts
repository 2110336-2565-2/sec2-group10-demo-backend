import { ApiProperty, PickType } from '@nestjs/swagger';

import { Music } from '../../schema/music.schema';

export class MusicsInPlaylistResponseDto extends PickType(Music, [
  'name',
  'duration',
  'coverImage',
  'albumId',
  'ownerId',
] as const) {
  @ApiProperty({ example: '5ff4c9d8e4b0f8b8b8b8b8b8' })
  musicId: string;

  @ApiProperty({ example: 'My album' })
  albumName: string;

  @ApiProperty({ example: 'My owner' })
  ownerName: string;
}
