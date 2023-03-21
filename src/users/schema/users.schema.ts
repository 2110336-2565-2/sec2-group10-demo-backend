import { Document, SchemaTypes, Types } from "mongoose";
import { Role } from "src/common/enums/role";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";

export type UserDocument = User & Document;

@Schema()
export class User {
  /**
   * ID of the user
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
   * Username of the user
   * @example Saveng58
   */
  @ApiProperty({ example: 'Saveng58' })
  @Prop({ required: true, unique: true })
  username: string;

  /**
   * Password of the user
   * @example Password58
   */

  @Prop({ required: true, minlength: 5, select: false })
  password: string;

  /**
   * email of the user
   * @example save-000@hotmail.com
   */
  @ApiProperty({ example: 'save-000@hotmail.com' })
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  /**
   * Registration date of the user
   */
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @Prop({
    default: function () {
      return Date.now();
    },
  })
  registrationDate: Date;

  /**
   * Account number of the user
   * @example 000000000000000000000000
   */
  @ApiProperty({ example: '0000000000' })
  @Prop({
    default: null,
  })
  accountNumber: number;

  /**
   * Bank name of the user
   * @example SCB
   */
  @ApiProperty({ example: 'SCB' })
  @Prop({
    default: null,
  })
  bankName: string;

  /**
   * role of the user
   * @example user
   */
  @ApiProperty({ example: ['user'] })
  @Prop({ default: ['user'] })
  roles: Role[];

  /**
   * followers of the user
   * @example ['sern@gmail.com']
   */
  @ApiProperty({ example: ['sern@gmail.com'] })
  @Prop({ default: [] })
  followers: string[];

  /**
   * following of the user
   * @example ['sern@gmail.com']
   */
  @ApiProperty({ example: ['sern@gmail.com'] })
  @Prop({ default: [] })
  following: string[];

  /**
   * url of profile image of the user
   * @example https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/LetterD.svg/1200px-LetterD.svg.png
   */
  @ApiProperty({
    example:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/LetterD.svg/1200px-LetterD.svg.png',
  })
  @Prop({ required: true })
  profileImage: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
