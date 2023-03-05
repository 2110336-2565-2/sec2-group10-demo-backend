import { Model, Types } from 'mongoose';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { EditPlaylistDto } from '../dto/edit-playlist.dto';
import { Playlist, PlaylistDocument } from '../schema/playlist.schema';
import {
  AddMusicToPlaylistResponseDto,
  MusicsInPlaylistResponseDto,
  RemoveMusicFromPlaylistResponseDto,
} from './dto/musics-in-playlist-response.dto';
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
    const playlist = await this.playlistModel
      .findById(playlistId, {
        _id: 1,
        name: 1,
        description: 1,
        coverImage: 1,
        userId: 1,
      })
      .populate('userId', { username: 1 });

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
      creatorName:
        playlist.userId && (playlist.userId as any).username
          ? (playlist.userId as any).username
          : '',
      creatorId: playlist.userId._id,
    };

    return res;
  }

  async getPlaylistsInfo(
    userId: Types.ObjectId,
    isAlbum: boolean,
  ): Promise<GetPlaylistInfoResponseDto[]> {
    // Initialize filter
    const filter = { userId: userId };
    if (isAlbum) {
      filter['isAlbum'] = true;
    }

    // Get playlists
    const playlists = await this.playlistModel
      .find(filter, {
        name: 1,
        description: 1,
        coverImage: 1,
        userId: 1,
      })
      .populate('userId', { username: 1 });

    const res: GetPlaylistInfoResponseDto[] = [];
    for (let playlist of playlists) {
      res.push({
        _id: playlist._id,
        name: playlist.name,
        description: playlist.description,
        coverImage: playlist.coverImage,
        creatorName:
          playlist.userId && (playlist.userId as any).username
            ? (playlist.userId as any).username
            : '',
        creatorId: playlist.userId._id,
      });
    }
    return res;
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
          url: 1,
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
        albumId: music.albumId && music.albumId._id ? music.albumId._id : '',
        albumName:
          music.albumId && music.albumId.name ? music.albumId.name : '',
        ownerId: music.ownerId && music.ownerId._id ? music.ownerId._id : '',
        ownerName:
          music.ownerId && music.ownerId.username ? music.ownerId.username : '',
        url: music.url ? music.url : '',
      });
    }

    return musics;
  }

  async addMusicToPlaylist(
    userId: Types.ObjectId,
    playlistId: Types.ObjectId,
    musicIds: Types.ObjectId[],
  ): Promise<AddMusicToPlaylistResponseDto> {
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) {
      throw new NotFoundException(
        `There isn't any playlist with id: ${playlistId}`,
      );
    }

    if (playlist.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        `You don't have permission to add music to this playlist`,
      );
    }

    const music = await this.playlistModel.findOneAndUpdate(
      { _id: playlistId },
      { $addToSet: { musics: { $each: musicIds } } },
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

    const res: AddMusicToPlaylistResponseDto = {
      name: music.name,
      description: music.description,
      coverImage: music.coverImage,
      musics: music.musics,
    };

    return res;
  }

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
