import { SchemaTypes, Types } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";

import { Music } from "./music.schema";
import { User } from "./users.schema";

export type PlaylistDocument = Playlist & Document;

@Schema()
export class Playlist {
  /**
   * ID of the playlist
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
   * Name of the playlist
   * @example My playlist
   * @maxLength 50
   * @minLength 1
   * @pattern ^[a-zA-Z0-9 ]*$
   * @required
   * @type string
   */
  @ApiProperty({ example: 'My playlist' })
  @Prop({
    required: true,
    maxlength: 50,
    minlength: 1,
    match: /^[a-zA-Z0-9 ]*$/,
  })
  name: string;

  /**
   * Description of the playlist
   * @example My playlist description
   * @maxLength 100
   * @minLength 1
   * @pattern ^[a-zA-Z0-9 ]*$
   * @default ''
   * @type string
   */
  @ApiProperty({ example: 'My playlist description' })
  @Prop({
    maxlength: 100,
    match: /^[a-zA-Z0-9 ]*$/,
    default: '',
  })
  description: string;

  /**
   * Date of creation of the playlist
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
   * ID of the user who created the playlist
   * @example 5ff4c9d8e4b0f8b8b8b8b8b8
   * @required
   * @type string
   */
  @ApiProperty({ example: '5ff4c9d8e4b0f8b8b8b8b8b8' })
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: User.name,
  })
  userId: Types.ObjectId;

  /**
   * ID of the songs in the playlist
   * @example ['5ff4c9d8e4b0f8b8b8b8b8b8']
   * @required
   * @type [string]
   */
  @ApiProperty({ example: ['5ff4c9d8e4b0f8b8b8b8b8b8'] })
  @Prop({
    type: [{ type: String }],
    required: true,
    ref: Music.name,
    default: [],
  })
  musics: string[];

  /**
   * Image of the playlist
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
   * Is album
   * @example true
   * @default false
   * @type boolean
   */
  @ApiProperty({ example: 'true' })
  @Prop({
    default: false,
  })
  isAlbum: boolean;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
