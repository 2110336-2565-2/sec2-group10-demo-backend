import { JoiValidationPipe } from 'src/utils/joiValidation.pipe';

import * as Joi from '@hapi/joi';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { MusicsService } from './musics.service';

@Controller('musics')
export class MusicsController {
  constructor(private readonly musicsService: MusicsService) {}

  @ApiResponse({
    status: 200,
    description: 'Return music information',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Shave of You' },
        url: {
          type: 'string',
          example: 'www.demomusic.com/music/shaveofu.mp3',
        },
        description: { type: 'string', example: 'Cool music by Ed She Run' },
      },
    },
  })
  @Get('/:id')
  async getMusic(
    @Param('id', new JoiValidationPipe(Joi.string().required()))
    id: string,
  ) {
    return await this.musicsService.getMusic(id);
  }
}
