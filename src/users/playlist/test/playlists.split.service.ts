import { Model, Types } from 'mongoose';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Playlist, PlaylistDocument } from '../../schema/playlist.schema';
import { User, UserDocument } from '../../schema/users.schema';
import { RemoveMusicFromPlaylistResponseDto } from '../dto/musics-in-playlist-response.dto';

@Injectable()
export class PlaylistsSplitService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async removeMusicFromPlaylist(
    userId: Types.ObjectId,
    playlistId: Types.ObjectId,
    musicIds: Types.ObjectId[],
  ): Promise<RemoveMusicFromPlaylistResponseDto> {
    const playlist = await this.playlistModel
      .findById(playlistId)
      .populate('musics', { albumId: 1 });
    if (!playlist) {
      throw new NotFoundException(
        `There isn't any playlist with id: ${playlistId}`,
      );
    }

    if (playlist.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        `You don't have permission to remove music from this playlist`,
      );
    }

    for (let music of playlist.musics as any) {
      if (music.albumId.toString() === playlistId.toString()) {
        throw new ForbiddenException(`You can't remove music from this album`);
      }
    }

    const music = await this.playlistModel.findOneAndUpdate(
      { _id: playlistId },
      { $pullAll: { musics: musicIds } },
      {
        projection: {
          _id: 0,
          name: 1,
          description: 1,
          coverImage: 1,
          musics: 1,
        },
        new: true,
      },
    );

    const res: RemoveMusicFromPlaylistResponseDto = {
      name: music.name,
      description: music.description,
      coverImage: music.coverImage,
      musics: music.musics,
    };

    return res;
  }
}
