import { Model, Types } from 'mongoose';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Role } from '../../common/enums/role';
import {
  albumPlaceHolder,
  playlistPlaceHolder,
} from '../../constants/placeHolder';
import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { EditPlaylistDto } from '../dto/edit-playlist.dto';
import {
  Playlist,
  PlaylistDocument,
  PlaylistType,
} from '../schema/playlist.schema';
import { User, UserDocument } from '../schema/users.schema';
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
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
        isAlbum: 1,
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
      isAlbum: playlist.isAlbum,
    };

    return res;
  }

  async getPlaylistsInfo(
    userId: Types.ObjectId,
    isAlbum: PlaylistType = PlaylistType.all,
  ): Promise<GetPlaylistInfoResponseDto[]> {
    // Initialize filter
    const filter = { userId: userId };
    if (isAlbum === PlaylistType.album) {
      filter['isAlbum'] = true;
    } else if (isAlbum === PlaylistType.playlist) {
      filter['isAlbum'] = false;
    }

    // Get playlists
    const playlists = await this.playlistModel
      .find(filter, {
        name: 1,
        description: 1,
        coverImage: 1,
        userId: 1,
        isAlbum: 1,
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
        isAlbum: playlist.isAlbum,
      });
    }
    return res;
  }

  async createPlaylist(
    userId: Types.ObjectId,
    createPlaylistDto: CreatePlaylistDto,
  ): Promise<CreatePlaylistResponseDto> {
    Object.assign(createPlaylistDto, {
      userId: userId,
      coverImage: createPlaylistDto.isAlbum
        ? albumPlaceHolder
        : playlistPlaceHolder,
    });

    const user = await this.userModel.findById(userId);
    if (createPlaylistDto.isAlbum && !user.roles.includes(Role.Artist)) {
      throw new UnauthorizedException('Only artist are allow to create album');
    }

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
    userId: Types.ObjectId,
    playlistId: Types.ObjectId,
    editPlayList: EditPlaylistDto,
  ): Promise<UpdatePlaylistInfoResponseDto> {
    let playlist = await this.playlistModel.findOne(
      { _id: playlistId },
      { userId: 1 },
    );

    if (playlist.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        `You don't have permission to update this playlist`,
      );
    }

    playlist = await this.playlistModel.findOneAndUpdate(
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

  async deletePlaylist(userId: Types.ObjectId, playlistId: Types.ObjectId) {
    let playlist = await this.playlistModel.findOne(
      { _id: playlistId },
      { userId: 1 },
    );

    if (playlist.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        `You don't have permission to delete this playlist`,
      );
    }

    playlist = await this.playlistModel.findByIdAndDelete(playlistId, {
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

    return res;
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
          genre: 1,
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
        genre: music.genre ? music.genre : '',
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

  async updateCoverImage(
    userId: Types.ObjectId,
    playlistId: Types.ObjectId,
    coverImage: string,
  ): Promise<CreatePlaylistResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist.userId.equals(userId))
      throw new UnauthorizedException('Playlist is not belong to user');

    const updatedPlaylist = await this.playlistModel.findByIdAndUpdate(
      playlistId,
      { coverImage: coverImage },
    );
    return updatedPlaylist;
  }
}
