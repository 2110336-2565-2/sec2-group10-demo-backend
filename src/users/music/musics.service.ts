import { get } from 'https';
import mongoose, { Model, Types } from 'mongoose';
import { parseBuffer } from 'music-metadata';
import { FileMetadata } from 'src/cloudStorage/googleCloud.interface';
import { Duplex } from 'stream';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { UploadMusicDto } from '../dto/upload-music.dto';
import { MusicsInPlaylistResponseDto } from '../playlist/dto/musics-in-playlist-response.dto';
import { PlaylistsService } from '../playlist/playlists.service';
import { Music, MusicDocument } from '../schema/music.schema';
import { GetMusicsResponseDto } from './dto/get-musics-response.dto';

@Injectable()
export class MusicsService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Music.name) private musicModel: Model<MusicDocument>,
    private readonly playlistsService: PlaylistsService,
  ) {}

  async getMusic(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new BadRequestException('invalid Music Id');
    const music = this.musicModel.findById(new Types.ObjectId(id));
    if (!music) throw new BadRequestException('music not found');
    return music;
  }

  async getMusics(genre: string = '') {
    let filter = {};
    if (genre !== '')
      Object.assign(filter, { genre: { $all: genre.split(',') } });
    const musics = this.musicModel.find(filter);
    return musics;
  }

  async uploadMusic(
    userId: Types.ObjectId,
    uploadMusicDto: UploadMusicDto,
    music: FileMetadata,
    coverImage: FileMetadata,
  ) {
    if (!(music && music.linkUrl)) {
      throw new BadRequestException('Only audio file are allowed');
    }
    if (!(coverImage && coverImage.linkUrl)) {
      throw new BadRequestException('Only image file are allowed');
    }

    // Get music duration
    const duration = await this.getMusicDuration(music.linkUrl);

    // Check if Album exist
    try {
      const album = await this.playlistsService.getPlaylistInfo(
        new Types.ObjectId(uploadMusicDto.albumId),
      );
      if (album.isAlbum === false) throw new BadRequestException();
    } catch (err) {
      throw new BadRequestException('Album not found');
    }

    // Attach url in to Music Dto
    Object.assign(uploadMusicDto, {
      ownerId: userId,
      coverImage: coverImage.linkUrl,
      url: music.linkUrl,
      duration: duration,
    });

    // Create and return the music
    let createdMusic = new this.musicModel(uploadMusicDto);
    const musicDoc = await createdMusic.save();

    // Add music to album
    await this.playlistsService.addMusicToPlaylist(
      userId,
      new Types.ObjectId(uploadMusicDto.albumId),
      [musicDoc._id],
    );

    return createdMusic;
  }

  async getMusicDuration(url: string) {
    const buffer = await this.urlToBuffer(url);
    const metadata = await parseBuffer(buffer, 'audio/mpeg');
    return Math.round(metadata.format.duration);
  }

  async urlToBuffer(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const data: Uint8Array[] = [];
      get(url, (res) => {
        res
          .on('data', (chunk: Uint8Array) => {
            data.push(chunk);
          })
          .on('end', () => {
            resolve(Buffer.concat(data));
          })
          .on('error', (err) => {
            reject(err);
          });
      });
    });
  }

  async bufferToStream(myBuffer) {
    let tmp = new Duplex();
    tmp.push(myBuffer);
    tmp.push(null);
    return tmp;
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
          url: 1,
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
        url: music.url,
      });
    }

    return res;
  }
}
