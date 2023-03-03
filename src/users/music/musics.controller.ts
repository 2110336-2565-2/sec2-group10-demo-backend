import { JoiValidationPipe } from 'src/utils/joiValidation.pipe';

import * as Joi from '@hapi/joi';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../../auth/public_decorator';
import { GetMusicsResponseDto } from './dto/get-musics-response.dto';
import { MusicsService } from './musics.service';

@ApiBearerAuth()
@ApiTags('users/musics')
@Controller('users/musics')
export class MusicsController {
  constructor(private readonly musicsService: MusicsService) {}

  @Get('/:id')
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
        artist: { type: 'string', example: 'Ed She Run' },
        coverImage: {
          type: 'string',
          example:
            'https://w7.pngwing.com/pngs/802/825/png-transparent-redbubble-polite-cat-meme-funny-cat-meme.png',
        },
      },
    },
  })
  async getMusic(
    @Param('id', new JoiValidationPipe(Joi.string().required()))
    id: string,
  ) {
    return await this.musicsService.getMusic(id);
  }

  @Public()
  @Get('/sample/:numberOfMusic')
  @ApiResponse({
    status: 200,
    description: 'Return sample musics',
    type: [GetMusicsResponseDto],
  })
  @ApiParam({
    name: 'numberOfMusic',
    description: 'Number of musics to return',
    type: Number,
  })
  async getSampleMusics(
    @Param('numberOfMusic', new JoiValidationPipe(Joi.number().required()))
    numberOfMusic: string,
  ): Promise<GetMusicsResponseDto[]> {
    return await this.musicsService.getSampleMusics(parseInt(numberOfMusic));
  }
}
