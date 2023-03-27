import * as Joi from '@hapi/joi';
import { Controller, Get, Query } from '@nestjs/common/decorators';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

import { Public } from '../../auth/public_decorator';
import { JoiValidationPipe } from '../../utils/joiValidation.pipe';
import { GetUsersInfoResponseDto } from '../dto/get-users.dto';
import { GetMusicsResponseDto } from '../music/dto/get-musics-response.dto';
import { GetPlaylistInfoResponseDto } from '../playlist/dto/playlist-response.dto';
import { SearchService } from './search.service';

@Public()
@Controller('users/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('musics')
  @ApiResponse({
    status: 200,
    description: 'Return musics that match the search term',
    type: [GetMusicsResponseDto],
  })
  @ApiQuery({
    name: 'term',
    description: 'Search term, if empty, return all musics',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of musics to return',
    type: Number,
    required: false,
  })
  async searchMusics(
    @Query('term', new JoiValidationPipe(Joi.string().optional()))
    term: string = '',
    @Query('limit', new JoiValidationPipe(Joi.number().optional()))
    limit: number = 5,
  ): Promise<GetMusicsResponseDto[]> {
    return await this.searchService.searchMusics(term, limit);
  }

  @Get('playlists')
  @ApiResponse({
    status: 200,
    description: 'Return musics that match the search term',
    type: [GetPlaylistInfoResponseDto],
  })
  @ApiQuery({
    name: 'term',
    description: 'Search term, if empty, return all playlists',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of playlists to return',
    type: Number,
    required: false,
  })
  async searchPlaylists(
    @Query('term', new JoiValidationPipe(Joi.string().optional()))
    term: string = '',
    @Query('limit', new JoiValidationPipe(Joi.number().optional()))
    limit: number = 5,
  ): Promise<GetPlaylistInfoResponseDto[]> {
    return await this.searchService.searchPlaylists(term, limit);
  }

  @Get('artists')
  @ApiResponse({
    status: 200,
    description: 'Return artists that match the search term',
    type: [GetPlaylistInfoResponseDto],
  })
  @ApiQuery({
    name: 'term',
    description: 'Search term, if empty, return all artists',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of artists to return',
    type: Number,
    required: false,
  })
  async searchArtists(
    @Query('term', new JoiValidationPipe(Joi.string().optional()))
    term: string = '',
    @Query('limit', new JoiValidationPipe(Joi.number().optional()))
    limit: number = 5,
  ): Promise<GetUsersInfoResponseDto[]> {
    return await this.searchService.searchArtists(term, limit);
  }
}
