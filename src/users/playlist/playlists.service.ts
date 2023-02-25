import { Model, Types } from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { EditPlaylistDto } from '../dto/edit-playlist.dto';
import { Playlist, PlaylistDocument } from '../schema/playlist.schema';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
  ) {}

  async getPlaylist(playlistId: Types.ObjectId) {
    const playlist = await this.playlistModel.findById(playlistId, {
      _id: 0,
      name: 1,
      description: 1,
      musics: 1,
      coverImage: 1,
    });

    if (!playlist) {
      throw new NotFoundException(
        `There isn't any playlist with id: ${playlistId}`,
      );
    }

    return playlist;
  }

  async getPlaylists(userId: Types.ObjectId) {
    const playlists = await this.playlistModel.find(
      { userId: userId },
      { _id: 0, name: 1, description: 1, musics: 1, coverImage: 1 },
    );
    return playlists;
  }

  async createPlaylist(
    userId: Types.ObjectId,
    createPlaylistDto: CreatePlaylistDto,
  ) {
    Object.assign(createPlaylistDto, { userId: userId });

    const playlist = new this.playlistModel(createPlaylistDto);
    return playlist.save();
  }

  async updatePlaylist(
    playlistId: Types.ObjectId,
    editPlayList: EditPlaylistDto,
  ) {
    const playlist = await this.playlistModel.findOneAndUpdate(
      { _id: playlistId },
      editPlayList,
      {
        projection: {
          name: 1,
          description: 1,
          coverImage: 1,
        },
        new: true,
      },
    );
    console.log(playlist);
    if (!playlist) {
      throw new NotFoundException(
        `There isn't any playlist with id: ${playlistId}`,
      );
    }

    const temp = playlist.toObject();
    delete temp._id;

    return temp;
  }

  async deletePlaylist(playlistId: Types.ObjectId) {
    const playlist = await this.playlistModel.findByIdAndDelete(playlistId, {
      projection: {
        _id: 0,
        name: 1,
        description: 1,
        musics: 1,
        coverImage: 1,
      },
    });

    if (!playlist) {
      throw new NotFoundException(
        `There isn't any playlist with id: ${playlistId}`,
      );
    }

    return playlist;
  }
}
