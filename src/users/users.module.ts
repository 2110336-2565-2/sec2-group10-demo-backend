import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UtilsService } from '../utils/utils.service';
import { MusicsController } from './music/musics.controller';
import { MusicsService } from './music/musics.service';
import { PlaylistsController } from './playlist/playlists.controller';
import { PlaylistsService } from './playlist/playlists.service';
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
    ]),
  ],
  controllers: [
    UsersController,
    MusicsController,
    PlaylistsController,
    SearchController,
  ],
  providers: [
    UsersService,
    MusicsService,
    PlaylistsService,
    UtilsService,
    SearchService,
  ],
  exports: [UsersService, MusicsService, PlaylistsService],
})
export class UsersModule {}
