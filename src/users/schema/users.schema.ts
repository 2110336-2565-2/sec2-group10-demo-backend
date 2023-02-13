import { Document, SchemaTypes, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
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
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  /**
   * Registration date of the user
   */
  @Prop({
    default: function () {
      return Date.now();
    },
  })
  registrationDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
