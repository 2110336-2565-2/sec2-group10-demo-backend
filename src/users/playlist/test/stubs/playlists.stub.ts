import { Types } from 'mongoose';

import { Playlist } from '../../../schema/playlist.schema';

export const createPlaylist = (body = {}): Playlist => {
  const defaultBody: Playlist = {
    _id: new Types.ObjectId(),
    name: 'mock playlist',
    description: 'mock playlist 2 of user 2',
    userId: new Types.ObjectId(),
    musics: [],
    coverImage: 'https://picsum.photos/200/200',
    isAlbum: false,
    creationDate: new Date(),
  };

  return { ...defaultBody, ...body };
};
