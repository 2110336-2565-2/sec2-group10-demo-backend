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
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JoiValidationPipe } from '../../utils/joiValidation.pipe';
import { UtilsService } from '../../utils/utils.service';
import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { EditPlaylistDto } from '../dto/edit-playlist.dto';
import {
  AddMusicToPlaylistBodyDto,
  AddMusicToPlaylistResponseDto,
  MusicsInPlaylistResponseDto,
  RemoveMusicFromPlaylistResponseDto,
} from './dto/musics-in-playlist-response.dto';
import {
  CreatePlaylistResponseDto,
  DeletePlaylistResponseDto,
  GetPlaylistInfoResponseDto,
  UpdatePlaylistInfoResponseDto,
} from './dto/playlist-response.dto';
import { PlaylistsService } from './playlists.service';

@ApiBearerAuth()
@ApiTags('users/playlists')
@Controller('users/playlists')
export class PlaylistsController {
  constructor(
    private readonly playlistService: PlaylistsService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get('all')
  @ApiQuery({
    name: 'isAlbum',
    description: 'If true, return only albums',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Return playlists',
    type: [GetPlaylistInfoResponseDto],
  })
  async getPlaylists(
    @Req() req,
    @Query('isAlbum') isAlbum: boolean = false,
  ): Promise<GetPlaylistInfoResponseDto[]> {
    this.utilsService.validateMongoId(req.user.userId);
    return await this.playlistService.getPlaylistsInfo(
      req.user.userId,
      isAlbum,
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Playlist id',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Return playlist information',
    type: GetPlaylistInfoResponseDto,
  })
  async getPlaylist(
    @Param('id', new JoiValidationPipe(Joi.string().required()))
    id: string,
  ): Promise<GetPlaylistInfoResponseDto> {
    this.utilsService.validateMongoId(id);
    return await this.playlistService.getPlaylistInfo(new Types.ObjectId(id));
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Return created playlist',
    type: CreatePlaylistResponseDto,
  })
  async createPlaylist(@Req() req, @Body() body: CreatePlaylistDto) {
    return await this.playlistService.createPlaylist(req.user.userId, body);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'Playlist id',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Return updated playlist',
    type: UpdatePlaylistInfoResponseDto,
  })
  async updatePlaylist(
    @Param('id', new JoiValidationPipe(Joi.string().required()))
    playlistId: string,
    @Body() body: EditPlaylistDto,
  ): Promise<UpdatePlaylistInfoResponseDto> {
    this.utilsService.validateMongoId(playlistId);
    return await this.playlistService.updatePlaylist(
      new Types.ObjectId(playlistId),
      body,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'Playlist id',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Return deleted playlist',
    type: DeletePlaylistResponseDto,
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

  @Get(':id/musics')
  @ApiParam({
    name: 'id',
    description: 'Playlist id',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Return musics in the playlist',
    type: [MusicsInPlaylistResponseDto],
  })
  async getMusicsInPlaylist(
    @Param('id', new JoiValidationPipe(Joi.string().required()))
    playlistId: string,
  ): Promise<MusicsInPlaylistResponseDto[]> {
    this.utilsService.validateMongoId(playlistId);
    return await this.playlistService.getMusicsInPlaylist(
      new Types.ObjectId(playlistId),
    );
  }

  @Post(':id/musics')
  @ApiParam({
    name: 'id',
    description: 'Playlist id',
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: 'Return playlist with added music',
    type: AddMusicToPlaylistResponseDto,
  })
  @ApiBody({
    description: 'Music ids',
    type: AddMusicToPlaylistBodyDto,
  })
  async addMusicToPlaylist(
    @Req() req,
    @Param('id', new JoiValidationPipe(Joi.string().required()))
    playlistId: string,
    @Body('musicIds')
    musicIds: string[],
  ): Promise<UpdatePlaylistInfoResponseDto> {
    this.utilsService.validateMongoId([...musicIds, playlistId]);

    let formatIds: Types.ObjectId[] = [];
    for (let musicId of musicIds) {
      formatIds.push(new Types.ObjectId(musicId));
    }
    return await this.playlistService.addMusicToPlaylist(
      req.user.userId,
      new Types.ObjectId(playlistId),
      formatIds,
    );
  }

  @Delete(':id/music/:musicId')
  @ApiParam({
    name: 'id',
    description: 'Playlist id',
    type: String,
  })
  @ApiParam({
    name: 'musicId',
    description: 'Music id',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Return playlist with removed music',
    type: RemoveMusicFromPlaylistResponseDto,
  })
  async removeMusicFromPlaylist(
    @Req() req,
    @Param('id', new JoiValidationPipe(Joi.string().required()))
    playlistId: string,
    @Param('musicId', new JoiValidationPipe(Joi.string().required()))
    musicId: string,
  ): Promise<UpdatePlaylistInfoResponseDto> {
    this.utilsService.validateMongoId([musicId, playlistId]);

    let formatIds: Types.ObjectId[] = [];
    formatIds.push(new Types.ObjectId(musicId));

    return await this.playlistService.removeMusicFromPlaylist(
      req.user.userId,
      new Types.ObjectId(playlistId),
      formatIds,
    );
  }
}
