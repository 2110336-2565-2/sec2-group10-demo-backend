import { IsEnum } from 'class-validator';

import { Optional } from '@nestjs/common';

import { PlaylistType } from '../../schema/playlist.schema';

export class FilterInputQueryDto {
  /**
   * Retuns only albums or only playlists or both, 1 for albums, 0 for playlists, 2 for both
   */
  @Optional()
  @IsEnum(PlaylistType)
  filter: PlaylistType = PlaylistType.all;
}
