import { IsEnum, IsOptional } from 'class-validator';
import { SchemaTypes, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { Genre } from '../../constants/music';
import { User } from './users.schema';

export type MusicDocument = Music & Document;

@Schema()
export class Music {
  /**
   * ID of the music
   * @example 5ff4c9d8e4b0f8b8b8b8b8b8
   */
  @ApiProperty({ example: '5ff4c9d8e4b0f8b8b8b8b8b8' })
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    auto: true,
  })
  _id: Types.ObjectId;

  /**
   * Name of the music
   * @example My music
   * @maxLength 50
   * @minLength 1
   * @pattern ^[a-zA-Z0-9 ]*$
   * @required
   * @type string
   */
  @ApiProperty({ example: 'My music' })
  @Prop({
    required: true,
    maxlength: 50,
    minlength: 1,
    match: /^[a-zA-Z0-9 ]*$/,
  })
  name: string;

  /**
   * Description of the music
   * @example My music description
   * @maxLength 100
   * @minLength 1
   * @pattern ^[a-zA-Z0-9 ]*$
   * @default ''
   * @type string
   */
  @ApiProperty({ example: 'My music description' })
  @Prop({
    maxlength: 100,
    minlength: 0,
    match: /^[a-zA-Z0-9 ]*$/,
    default: '',
  })
  description: string;

  /**
   * Date of creation of the music
   * @example 2021-01-01T00:00:00.000Z
   * @type string
   * @format date-time
   * @default Date.now()
   */
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @Prop({
    default: function () {
      return Date.now();
    },
  })
  creationDate: Date;

  /**
   * ID of the album of the music
   * @example 5ff4c9d8e4b0f8b8b8b8b8b8
   * @required
   * @type string
   */
  @ApiProperty({ example: '5ff4c9d8e4b0f8b8b8b8b8b8' })
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'Playlist',
  })
  albumId: Types.ObjectId;

  /**
   * Image of the music
   * @example https://www.google.com
   * @required
   * @type string
   */
  @ApiProperty({ example: 'https://www.google.com' })
  @Prop({
    required: true,
  })
  coverImage: string;

  /**
   * URL of the music
   * @example https://www.google.com
   * @required
   * @type string
   */
  @ApiProperty({ example: 'https://www.google.com' })
  @Prop({
    required: true,
  })
  url: string;

  /**
   * Object Id of user who uploaded the music
   * @example 5ff4c9d8e4b0f8b8b8b8b8b8
   * @required
   */
  @ApiProperty({ example: '5ff4c9d8e4b0f8b8b8b8b8b8' })
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    auto: false,
    ref: User.name,
  })
  ownerId: Types.ObjectId;

  /**
   * Duration of the music in second
   * @example 211
   * @required
   * @type number
   */
  @ApiProperty({ example: 211 })
  @Prop({
    type: Number,
    required: true,
  })
  duration: number;

  /**
   * Array of music genre
   * @example ['Pop','Hip-Hop']
   * @required
   * @type Genre[]
   */
  @ApiProperty({ example: ['Pop', 'Hip-Hop'] })
  @IsEnum(Genre, { each: true })
  @IsOptional()
  @Prop({
    required: false,
  })
  genre?: Genre[];
}

export const MusicSchema = SchemaFactory.createForClass(Music);
