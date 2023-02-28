import { Model, Types } from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { EditPlaylistDto } from '../dto/edit-playlist.dto';
import { Playlist, PlaylistDocument } from '../schema/playlist.schema';
import { MusicsInPlaylistResponseDto } from './dto/musics-in-playlist-response.dto';
import {
  CreatePlaylistResponseDto,
  DeletePlaylistResponseDto,
  GetPlaylistInfoResponseDto,
  UpdatePlaylistInfoResponseDto,
} from './dto/playlist-response.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
  ) {}

  async getPlaylistInfo(
    playlistId: Types.ObjectId,
  ): Promise<GetPlaylistInfoResponseDto> {
    const playlist = await this.playlistModel.findById(playlistId, {
      _id: 1,
      name: 1,
      description: 1,
      coverImage: 1,
    });

    if (!playlist) {
      throw new NotFoundException(
        `There isn't any playlist with id: ${playlistId}`,
      );
    }

    const res: GetPlaylistInfoResponseDto = {
      _id: playlist._id,
      name: playlist.name,
      description: playlist.description,
      coverImage: playlist.coverImage,
    };

    return playlist;
  }

  async getMusicsInPlaylist(
    playlistId: Types.ObjectId,
  ): Promise<MusicsInPlaylistResponseDto[]> {
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

    const musics: MusicsInPlaylistResponseDto[] = [];
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

  async getPlaylists(
    userId: Types.ObjectId,
  ): Promise<GetPlaylistInfoResponseDto[]> {
    const playlists = await this.playlistModel.find(
      { userId: userId },
      { name: 1, description: 1, coverImage: 1 },
    );

    const res: GetPlaylistInfoResponseDto[] = [];
    for (let playlist of playlists) {
      res.push({
        _id: playlist._id,
        name: playlist.name,
        description: playlist.description,
        coverImage: playlist.coverImage,
      });
    }
    return playlists;
  }

  async createPlaylist(
    userId: Types.ObjectId,
    createPlaylistDto: CreatePlaylistDto,
  ): Promise<CreatePlaylistResponseDto> {
    Object.assign(createPlaylistDto, { userId: userId });

    const playlist = new this.playlistModel(createPlaylistDto);
    const createdPlaylist = await playlist.save();

    const res: CreatePlaylistResponseDto = {
      _id: createdPlaylist._id,
      name: createdPlaylist.name,
      description: createdPlaylist.description,
      coverImage: createdPlaylist.coverImage,
      musics: createdPlaylist.musics,
    };

    return res;
  }

  async updatePlaylist(
    playlistId: Types.ObjectId,
    editPlayList: EditPlaylistDto,
  ): Promise<UpdatePlaylistInfoResponseDto> {
    const playlist = await this.playlistModel.findOneAndUpdate(
      { _id: playlistId },
      editPlayList,
      {
        projection: {
          _id: 0,
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

    const res: UpdatePlaylistInfoResponseDto = {
      name: playlist.name,
      description: playlist.description,
      coverImage: playlist.coverImage,
    };

    return res;
  }

  async deletePlaylist(playlistId: Types.ObjectId) {
    const playlist = await this.playlistModel.findByIdAndDelete(playlistId, {
      projection: {
        _id: 0,
        name: 1,
        description: 1,
        coverImage: 1,
      },
    });

    if (!playlist) {
      throw new NotFoundException(
        `There isn't any playlist with id: ${playlistId}`,
      );
    }

    const res: DeletePlaylistResponseDto = {
      name: playlist.name,
      description: playlist.description,
      coverImage: playlist.coverImage,
    };

    return playlist;
  }
}
