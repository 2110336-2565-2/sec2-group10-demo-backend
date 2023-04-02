import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Role } from '../../common/enums/role';
import { Genre } from '../../constants/music';
import { GetArtistsInfoResponseDto } from '../dto/get-users.dto';
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
    const genre = this.extractGenre(term);
    const musics_by_genre = await this.musicModel
      .find({
        genre: { $all: genre },
      })
      .populate('albumId', { name: 1 })
      .populate('ownerId', { username: 1 })
      .limit(limit);

    const musics_by_name = await this.musicModel
      .find({ name: { $regex: term, $options: 'i' } })
      .populate('albumId', { name: 1 })
      .populate('ownerId', { username: 1 })
      .limit(limit);
    const res: GetMusicsResponseDto[] = [];
    let j = 0;
    while (
      res.length < limit - Math.floor(limit / 4) &&
      j < musics_by_name.length
    ) {
      const music = musics_by_name[j] as any;
      if (!res.find((m) => m.musicId === music._id.toString())) {
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
          genre: music.genre,
        });
      }
      j++;
    }
    let i = 0;
    while (res.length < limit && i < musics_by_genre.length) {
      const music = musics_by_genre[i] as any;
      if (!res.find((m) => m.musicId === music._id.toString())) {
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
          genre: music.genre,
        });
      }
      i++;
    }
    while (res.length < limit && j < musics_by_name.length) {
      const music = musics_by_name[j] as any;
      if (!res.find((m) => m.musicId === music._id.toString())) {
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
          genre: music.genre,
        });
      }
      j++;
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
  ): Promise<GetArtistsInfoResponseDto[]> {
    const artists = await this.userModel
      .find({
        roles: { $elemMatch: { $eq: Role.Artist } },
        username: { $regex: term, $options: 'i' },
      })
      .limit(limit);

    const res: GetArtistsInfoResponseDto[] = [];
    for (const artist of artists) {
      let temp: GetArtistsInfoResponseDto = {
        _id: artist._id,
        username: artist.username,
        email: artist.email,
        registrationDate: artist.registrationDate,
        roles: artist.roles,
        profileImage: artist.profileImage,
        accountNumber: artist.accountNumber,
      };
      res.push(temp);
    }
    return res;
  }

  extractGenre(term: string): Genre[] {
    const genres: Genre[] = [];
    for (const genre of Object.values(Genre)) {
      if (term.toLowerCase().includes(genre.toLowerCase())) {
        genres.push(genre);
      }
    }
    return genres;
  }
}
