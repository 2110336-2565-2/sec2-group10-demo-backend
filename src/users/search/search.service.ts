import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Role } from '../../common/enums/role';
import { GetUsersInfoResponseDto } from '../dto/get-users.dto';
import { GetMusicsResponseDto } from '../music/dto/get-musics-response.dto';
import { GetPlaylistInfoResponseDto } from '../playlist/dto/playlist-response.dto';
import { Music, MusicDocument } from '../schema/music.schema';
import { Playlist, PlaylistDocument } from '../schema/playlist.schema';
import { User, UserDocument } from '../schema/users.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Music.name) private musicModel: Model<MusicDocument>,
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async searchMusics(term: string, limit = 5): Promise<GetMusicsResponseDto[]> {
    const musics = await this.musicModel
      .find({ name: { $regex: term, $options: 'i' } })
      .populate('albumId', { name: 1 })
      .populate('ownerId', { username: 1 })
      .limit(limit);
    const res: GetMusicsResponseDto[] = [];
    for (const music of musics as any) {
      res.push({
        musicId: music._id.toString(),
        name: music.name,
        coverImage: music.coverImage,
        ownerId: music.ownerId ? music.ownerId._id : '',
        ownerName: music.ownerId ? music.ownerId.username : '',
        albumId: music.albumId ? music.albumId._id : '',
        albumName: music.albumId ? music.albumId.name : '',
        duration: music.duration,
        url: music.url,
      });
    }
    return res;
  }

  async searchPlaylists(
    term: string,
    limit = 5,
  ): Promise<GetPlaylistInfoResponseDto[]> {
    const playlists = await this.playlistModel
      .find({ name: { $regex: term, $options: 'i' } })
      .populate('userId', { username: 1 })
      .limit(limit);
    const res: GetPlaylistInfoResponseDto[] = [];
    for (const playlist of playlists as any) {
      res.push({
        _id: playlist._id,
        name: playlist.name,
        description: playlist.description,
        coverImage: playlist.coverImage,
        creatorId: playlist.userId ? playlist.userId._id : '',
        creatorName: playlist.userId ? playlist.userId.username : '',
        isAlbum: playlist.isAlbum,
      });
    }
    return res;
  }

  async searchArtists(
    term: string,
    limit = 5,
  ): Promise<GetUsersInfoResponseDto[]> {
    const artists = await this.userModel
      .find({
        roles: { $elemMatch: { $eq: Role.Artist } },
        username: { $regex: term, $options: 'i' },
      })
      .limit(limit);

    const res: GetUsersInfoResponseDto[] = [];
    for (const artist of artists) {
      res.push(artist);
    }
    return res;
  }
}
