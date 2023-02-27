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

  async getPlaylistInfo(playlistId: Types.ObjectId) {
    const playlist = await this.playlistModel.findById(playlistId, {
      _id: 0,
      name: 1,
      description: 1,
      coverImage: 1,
    });

    if (!playlist) {
      throw new NotFoundException(
        `There isn't any playlist with id: ${playlistId}`,
      );
    }

    return playlist;
  }

  async getMusicsInPlaylist(playlistId: Types.ObjectId) {
    const playlist = await this.playlistModel
      .findById(playlistId, {
        name: 1,
        description: 1,
        musics: 1,
        coverImage: 1,
      })
      .populate({
        path: 'musics',
        populate: [
          {
            path: 'albumId',
            select: {
              name: 1,
            },
          },
          {
            path: 'ownerId',
            select: {
              username: 1,
            },
          },
        ],
        select: {
          name: 1,
          duration: 1,
          coverImage: 1,
          albumId: 1,
          ownerId: 1,
        },
      });

    if (!playlist) {
      throw new NotFoundException(
        `There isn't any playlist with id: ${playlistId}`,
      );
    }

    const musics = [];
    for (let music of playlist.musics as any) {
      musics.push({
        musicId: music._id,
        name: music.name,
        duration: music.duration ? music.duration : '',
        coverImage: music.coverImage ? music.coverImage : '',
        albumId: music.albumId._id ? music.albumId._id : '',
        albumName: music.albumId.name ? music.albumId.name : '',
        ownerId: music.ownerId._id ? music.ownerId._id : '',
        ownerName: music.ownerId.username ? music.ownerId.username : '',
      });
    }

    return musics;
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
