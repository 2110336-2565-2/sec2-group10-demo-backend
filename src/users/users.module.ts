import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UtilsService } from '../utils/utils.service';
import { AdvertisementController } from './advertisement/advertisement.controller';
import { AdvertisementService } from './advertisement/advertisment.service';
import { MusicsController } from './music/musics.controller';
import { MusicsService } from './music/musics.service';
import { PlaylistsController } from './playlist/playlists.controller';
import { PlaylistsService } from './playlist/playlists.service';
import {
  Advertisement,
  AdvertisementSchema,
} from './schema/advertisement.schema';
import { Music, MusicSchema } from './schema/music.schema';
import { Playlist, PlaylistSchema } from './schema/playlist.schema';
import { User, UserSchema } from './schema/users.schema';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Music.name, schema: MusicSchema },
      { name: Advertisement.name, schema: AdvertisementSchema },
    ]),
  ],
  controllers: [
    UsersController,
    MusicsController,
    PlaylistsController,
    SearchController,
    AdvertisementController,
  ],
  providers: [
    UsersService,
    MusicsService,
    PlaylistsService,
    UtilsService,
    SearchService,
    AdvertisementService,
  ],
  exports: [UsersService, MusicsService, PlaylistsService],
})
export class UsersModule {}
