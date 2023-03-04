import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MusicsInPlaylistResponseDto } from '../playlist/dto/musics-in-playlist-response.dto';
import { Music, MusicDocument } from '../schema/music.schema';
import { GetMusicsResponseDto } from './dto/get-musics-response.dto';

@Injectable()
export class MusicsService {
  constructor(
    @InjectModel(Music.name) private musicModel: Model<MusicDocument>,
  ) {}

  async getMusic(id: string) {
    const dumpUrl =
      'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptitle=Never+Gonna+Give+You+Up-+Original&filename=mz/Mzg1ODMxNTIzMzg1ODM3_JzthsfvUY24.MP3';
    return {
      name: 'Dump Music',
      url: dumpUrl,
      descrpition: 'Dump music for testing API',
      artist: 'Dump Man',
      coverImage:
        'https://www.pngmart.com/files/11/Frog-Meme-PNG-Transparent.png',
    };
  }

  async getSampleMusics(
    numberOfMusic: number,
  ): Promise<GetMusicsResponseDto[]> {
    const musics = await this.musicModel.aggregate([
      { $sample: { size: numberOfMusic } },
      {
        $lookup: {
          from: 'playlists',
          localField: 'albumId',
          foreignField: '_id',
          as: 'album',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          coverImage: 1,
          creatorId: '$ownerId',
          albumId: 1,
          albumName: { $arrayElemAt: ['$album.name', 0] },
          ownerName: { $arrayElemAt: ['$owner.username', 0] },
          duration: 1,
        },
      },
    ]);

    const res: MusicsInPlaylistResponseDto[] = [];
    for (const music of musics) {
      res.push({
        musicId: music._id,
        name: music.name,
        coverImage: music.coverImage,
        ownerId: music.creatorId,
        albumId: music.albumId,
        albumName: music.albumName,
        ownerName: music.ownerName,
        duration: music.duration,
      });
    }

    return res;
  }
}
