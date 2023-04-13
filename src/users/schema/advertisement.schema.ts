import { SchemaTypes, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AdvertisementDocument = Advertisement & Document;

@Schema()
export class Advertisement {
  /**
   * ID of the advertisment
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
   * Name of the advertisment
   * @example My advertisment
   * @maxLength 50
   * @minLength 1
   * @pattern ^[a-zA-Z0-9 ]*$
   * @required
   * @type string
   */
  @ApiProperty({ example: 'ads' })
  @Prop({
    required: true,
    maxlength: 50,
    minlength: 1,
    match: /^[a-zA-Z0-9 ]*$/,
  })
  name: string;

  /**
   * Description of the advertisment
   * @example My advertisment description
   * @maxLength 100
   * @minLength 1
   * @pattern ^[a-zA-Z0-9 ]*$
   * @default ''
   * @type string
   */
  @ApiProperty({ example: 'advertisment description' })
  @Prop({
    maxlength: 100,
    minlength: 0,
    match: /^[a-zA-Z0-9 ]*$/,
    default: '',
  })
  description: string;

  /**
   * Date of creation of the advertisment
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
   * URL of the advertisment
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
   * Duration of the advertisment in second
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
}

export const AdvertisementSchema = SchemaFactory.createForClass(Advertisement);
