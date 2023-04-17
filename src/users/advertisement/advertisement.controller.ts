import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

import { Public } from '../../auth/public_decorator';
import { Advertisement } from '../schema/advertisement.schema';
import { AdvertisementService } from './advertisment.service';

@Controller('users/advertisement')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @Public()
  @ApiResponse({
    status: 200,
    description: 'Return list of random ads',
    type: [Advertisement],
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of ads to return, default to 1',
    type: Number,
    required: false,
    example: 5,
  })
  @Get('/random')
  async getRandomAds(
    @Query('limit') limit: number = 1,
  ): Promise<Advertisement[]> {
    return await this.advertisementService.getRandomAds(limit);
  }
}
