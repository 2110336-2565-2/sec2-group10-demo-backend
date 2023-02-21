import { Document, SchemaTypes, Types } from 'mongoose';
import { Role } from 'src/common/enums/role';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ example: '000000000000000000000000' })
  @Prop({})
  accountNumber: number;

  /**
   * Bank name of the user
   * @example SCB
   */
  @ApiProperty({ example: 'SCB' })
  @Prop({})
  bankName: string;

  /**
   * credit card name
   * @example Pol Wongnai
   */
  @ApiProperty({ example: 'Pol Wongnai' })
  @Prop({})
  creditCardName: string;

  /**
   * credit card number
   * @example 0000000000000000
   */
  @ApiProperty({ example: '0000000000000000' })
  @Prop({})
  creditCardNumber: number;

  /**
   * credit card expire date
   * @example 01/2021
   **/
  @ApiProperty({ example: '01/2021' })
  @Prop({})
  creditCardExpireDate: string;

  /**
   * credit card cvv
   * @example 000
   * */
  @ApiProperty({ example: '000' })
  @Prop({})
  creditCardCVV: number;

  /**
   * role of the user
   * @example user
   * */
  @ApiProperty({ example: 'user' })
  @Prop({ default: 'user', enum: Role })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
