import MulterGoogleCloudStorage from "multer-cloud-storage";
import { FileMetadata } from "src/cloudStorage/googleCloud.interface";
import {
  STORAGE_OPTIONS,
  uploadLimits,
  uploadMusicImageFilter
} from "src/cloudStorage/googleCloud.utils";
import { JoiValidationPipe } from "src/utils/joiValidation.pipe";

import * as Joi from "@hapi/joi";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";

import { Public } from "../../auth/public_decorator";
import { UploadMusicDto } from "../dto/upload-music.dto";
import { Music } from "../schema/music.schema";
import { GetMusicsResponseDto } from "./dto/get-musics-response.dto";
import { MusicsService } from "./musics.service";

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

  @Post('')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'music', maxCount: 1 },
      ],
      {
        storage: new MulterGoogleCloudStorage(STORAGE_OPTIONS),
        fileFilter: uploadMusicImageFilter,
        limits: uploadLimits,
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload music to an album',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Shave of You',
        },
        description: {
          type: 'string',
          example: 'My coolest music!',
        },
        albumId: {
          type: 'string',
          example: '6401f35af8e60e217902722c',
        },
        music: {
          type: 'file',
        },
        coverImage: {
          type: 'file',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Return the created music',
    type: Music, //Actually not, but kinda
  })
  async uploadMusic(
    @Request() req,
    @UploadedFiles()
    files: { coverImage: FileMetadata[]; music: FileMetadata[] },
    @Body() uploadMusicDto: UploadMusicDto,
  ) {
    return await this.musicsService.uploadMusic(
      req.user.userId,
      uploadMusicDto,
      files.music[0],
      files.coverImage[0],
    );
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
