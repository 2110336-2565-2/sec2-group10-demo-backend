import { PlaylistsService } from 'src/users/playlist/playlists.service';
import { Playlist, PlaylistSchema } from 'src/users/schema/playlist.schema';
import { User, UserSchema } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/users.service';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
  ],
  controllers: [],
  providers: [UsersService, PlaylistsService],
  exports: [],
})
export class RolesModule {}
