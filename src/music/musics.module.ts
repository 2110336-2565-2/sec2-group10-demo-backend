import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MusicsController } from './musics.controller';
import { MusicsService } from './musics.service';
import { Music, MusicSchema } from './schema/music.schema';
import { Playlist, PlaylistSchema } from './schema/playlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Music.name,
        schema: MusicSchema,
      },
      {
        name: Playlist.name,
        schema: PlaylistSchema,
      },
    ]),
  ],
  controllers: [MusicsController],
  providers: [MusicsService],
  exports: [MusicsService],
})
export class MusicsModule {}
