import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  /*
   *   comment section
   */
  @Prop({ required: true })
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
