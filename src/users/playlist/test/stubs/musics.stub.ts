import { Types } from 'mongoose';

import { Genre } from '../../../../constants/music';
import { Music } from '../../../schema/music.schema';

export const createMusic = (body = {}): Music => {
  const defaultBody: Music = {
    _id: new Types.ObjectId(),
    name: 'mock music',
    description: 'mock',
    albumId: new Types.ObjectId(),
    coverImage: 'https://picsum.photos/200/300',
    url: 'https://demo-by-tuder-sound-bucket.s3.ap-southeast-1.amazonaws.com/01+%E0%B9%80%E0%B8%AA%E0%B9%81%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%87+(Pretend)+%5Bfeat.+Moon%5D+-+Paper+Planes.mp3',
    creationDate: new Date(),
    ownerId: new Types.ObjectId(),
    genre: [Genre.Pop],
    duration: 223,
  };

  return { ...defaultBody, ...body };
};
