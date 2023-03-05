import { get } from 'https';
import mongoose, { Model, Types } from 'mongoose';
import { Duplex } from 'stream';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { UploadMusicDto } from '../dto/upload-music.dto';
import { PlaylistsService } from '../playlist/playlists.service';
import { Music, MusicDocument } from '../schema/music.schema';

@Injectable()
export class MusicsService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Music.name) private musicModel: Model<MusicDocument>,
    private readonly playlistsService: PlaylistsService,
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

  async uploadMusic(
    userId: Types.ObjectId,
    uploadMusicDto: UploadMusicDto,
    music: Express.Multer.File,
    coverImage: Express.Multer.File,
  ) {
    if (!(music && music.path)) {
      throw new BadRequestException('Only audio file are allowed');
    }
    if (!(coverImage && coverImage.path)) {
      throw new BadRequestException('Only image file are allowed');
    }

    // Get music duration
    const duration = await this.getMusicDuration(music.path);

    // Check if Album exist
    try {
      const album = await this.playlistsService.getPlaylistInfo(
        new Types.ObjectId(uploadMusicDto.albumId),
      );
    } catch (err) {
      throw new BadRequestException('Album not found');
    }

    // Attach url in to Music Dto
    Object.assign(uploadMusicDto, {
      userId: userId,
      coverImage: coverImage.path,
      url: music.path,
      duration: duration,
    });

    // Create and return the music
    let createdMusic = new this.musicModel(uploadMusicDto);
    return createdMusic.save();
  }

  async getMusicDuration(url: string) {
    return '00:00:00';

    // ⬇️ This code return "No duration found!"
    // console.log('URL : ', url);
    // const buffer = await this.urlToBuffer(url);
    // const stream = await this.bufferToStream(buffer);
    // const duration = await getAudioDurationInSeconds(stream);
    // return duration;

    // ⬇️ fs document said that createReadStream can receive url/ buffer as well, but that's just a lie
    // const stream = createReadStream(
    //   new URL(
    //     'https://storage.googleapis.com/demo-tuder-music/Shave%20of%20You.mp3',
    //   ),
    // );
    // const duration = await getAudioDurationInSeconds(stream);
    // return duration;

    // ⬇️ Some not working code
    // const mp3file =
    //   'https://raw.githubusercontent.com/prof3ssorSt3v3/media-sample-files/master/doorbell.mp3';
    // const audioContext = new window.AudioContext();
    // const request = new XMLHttpRequest();
    // request.open('GET', mp3file, true);
    // request.responseType = 'arraybuffer';
    // request.onload = function () {
    //   audioContext.decodeAudioData(request.response, function (buffer) {
    //     let duration = buffer.duration;
    //     console.log(duration);
    //     //document.write(duration);
    //   });
    // };
    // request.send();
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
}
