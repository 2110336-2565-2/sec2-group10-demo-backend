import { IsEnum, IsNotEmpty } from 'class-validator';

import { Optional } from '@nestjs/common';

import { PlaylistType } from '../../schema/playlist.schema';

export class FilterInputQueryDto {
  /**
   * The id of user
   * @example 5f9f1c9b9b9b9b9b9b9b9b9b
   */
  @IsNotEmpty()
  userId: string;

  /**
   * Retuns only albums or only playlists or both, 1 for albums, 0 for playlists, 2 for both
   */
  @Optional()
  @IsEnum(PlaylistType)
  filter: PlaylistType = PlaylistType.all;
}
