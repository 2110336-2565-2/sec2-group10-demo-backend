import { Types } from 'mongoose';

import * as Joi from '@hapi/joi';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JoiValidationPipe } from '../../utils/joiValidation.pipe';
import { UtilsService } from '../../utils/utils.service';
import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { EditPlaylistDto } from '../dto/edit-playlist.dto';
import { PlaylistsService } from './playlists.service';

@ApiBearerAuth()
@ApiTags('users/playlists')
@Controller('users/playlists')
export class PlaylistsController {
  constructor(
    private readonly playlistService: PlaylistsService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get('/all')
  @ApiResponse({
    status: 200,
    description: 'Return playlists',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'My playlist' },
          description: { type: 'string', example: 'My playlist description' },
          musics: {
            type: 'array',
            example: ['5ff4c9d8e4b0f8b8b8b8b8b8'],
          },
          coverImage: {
            type: 'string',
            example:
              'https://w7.pngwing.com/pngs/802/825/png-transparent-redbubble-polite-cat-meme-funny-cat-meme.png',
          },
        },
      },
    },
  })
  async getPlaylists(@Req() req) {
    this.utilsService.validateMongoId(req.user.userId);
    return await this.playlistService.getPlaylists(req.user.userId);
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'Return playlist information',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'My playlist' },
        description: { type: 'string', example: 'My playlist description' },
        musics: {
          type: 'array',
          example: ['5ff4c9d8e4b0f8b8b8b8b8b8'],
        },
        coverImage: {
          type: 'string',
          example:
            'https://w7.pngwing.com/pngs/802/825/png-transparent-redbubble-polite-cat-meme-funny-cat-meme.png',
        },
      },
    },
  })
  async getPlaylist(
    @Param('id', new JoiValidationPipe(Joi.string().required()))
    id: string,
  ) {
    this.utilsService.validateMongoId(id);
    return await this.playlistService.getPlaylistInfo(new Types.ObjectId(id));
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Return created playlist',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'My playlist' },
        description: { type: 'string', example: 'My playlist description' },
        musics: {
          type: 'array',
          example: ['5ff4c9d8e4b0f8b8b8b8b8b8'],
        },
        coverImage: {
          type: 'string',
          example:
            'https://w7.pngwing.com/pngs/802/825/png-transparent-redbubble-polite-cat-meme-funny-cat-meme.png',
        },
      },
    },
  })
  async createPlaylist(@Req() req, @Body() body: CreatePlaylistDto) {
    return await this.playlistService.createPlaylist(req.user.userId, body);
  }

  @Patch('/:id')
  @ApiResponse({
    status: 200,
    description: 'Return updated playlist',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'My playlist' },
        description: { type: 'string', example: 'My playlist description' },
        coverImage: {
          type: 'string',
          example:
            'https://w7.pngwing.com/pngs/802/825/png-transparent-redbubble-polite-cat-meme-funny-cat-meme.png',
        },
      },
    },
  })
  async updatePlaylist(
    @Param('id', new JoiValidationPipe(Joi.string().required()))
    playlistId: string,
    @Body() body: EditPlaylistDto,
  ) {
    this.utilsService.validateMongoId(playlistId);
    return await this.playlistService.updatePlaylist(
      new Types.ObjectId(playlistId),
      body,
    );
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'Return deleted playlist',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'My playlist' },
        description: { type: 'string', example: 'My playlist description' },
        musics: {
          type: 'array',
          example: ['5ff4c9d8e4b0f8b8b8b8b8b8'],
        },
        coverImage: {
          type: 'string',
          example:
            'https://w7.pngwing.com/pngs/802/825/png-transparent-redbubble-polite-cat-meme-funny-cat-meme.png',
        },
      },
    },
  })
  async deletePlaylist(
    @Param('id', new JoiValidationPipe(Joi.string().required()))
    playlistId: string,
  ) {
    this.utilsService.validateMongoId(playlistId);
    return await this.playlistService.deletePlaylist(
      new Types.ObjectId(playlistId),
    );
  }

  @Get('/:id/musics')
  @ApiResponse({
    status: 200,
    description: 'Return musics in the playlist',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'My music' },
          duration: { type: 'number', example: 200 },
          coverImage: {
            type: 'string',
            example:
              'https://w7.pngwing.com/pngs/802/825/png-transparent-redbubble-polite-cat-meme-funny-cat-meme.png',
          },
          albumId: {
            type: 'string',
            example: '5ff4c9d8e4b0f8b8b8b8b8b8',
          },
          albumName: { type: 'string', example: 'My album' },
          ownerId: { type: 'string', example: '5ff4c9d8e4b0f8b8b8b8b8b8' },
          ownerName: { type: 'string', example: 'My name' },
        },
      },
    },
  })
  async getMusicsInPlaylist(
    @Param('id', new JoiValidationPipe(Joi.string().required()))
    playlistId: string,
  ) {
    this.utilsService.validateMongoId(playlistId);
    return await this.playlistService.getMusicsInPlaylist(
      new Types.ObjectId(playlistId),
    );
  }
}
