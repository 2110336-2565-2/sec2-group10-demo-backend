import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  Advertisement,
  AdvertisementDocument,
} from '../schema/advertisement.schema';

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectModel(Advertisement.name)
    private adsModel: Model<AdvertisementDocument>,
  ) {}

  async getRandomAds(limit: number = 1): Promise<Advertisement[]> {
    const collectionSize = await this.adsModel.countDocuments();
    const ads = await this.adsModel
      .find()
      .skip(
        Math.min(
          Math.floor(Math.random() * collectionSize),
          Math.max(collectionSize - limit, 0),
        ),
      )
      .limit(limit);
    return ads;
  }
}
