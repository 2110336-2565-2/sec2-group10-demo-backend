import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Music } from './schema/music.schema';
import { Playlist } from './schema/playlist.schema';

@Injectable()
export class MusicsService {
  constructor(
    @InjectModel(Music.name) private musicModel: Model<Music>,
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
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

  async test() {
    const playlist = new this.playlistModel({
      userId: '5f9f1b5b9b9b9b9b9b9b9b9b',
      name: 'My Playlist',
      description: 'My favorite music',
      musics: [],
      image: 'https://www.pngmart.com/files/11/Frog-Meme-PNG-Transparent.png',
    });
    const newPlaylist = await playlist.save();

    const music = new this.musicModel({
      name: 'Shave of You',
      url: 'www.demomusic.com/music/shaveofu.mp3',
      description: 'Cool music by Ed She Run',
      artist: 'Ed She Run',
      image:
        'https://w7.pngwing.com/pngs/802/825/png-transparent-redbubble-polite-cat-meme-funny-cat-meme.png',
      albumId: newPlaylist._id,
    });
    const newMusic = await music.save();
    console.log(newMusic);

    newPlaylist.musics.push(newMusic._id);
    console.log(
      await this.playlistModel.findOneAndUpdate(
        { _id: newPlaylist._id },
        { musics: newPlaylist.musics },
        { new: true },
      ),
    );

    return await this.playlistModel.find();
  }
}
