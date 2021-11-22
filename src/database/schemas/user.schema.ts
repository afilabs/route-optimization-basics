import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, lowercase: true })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  token: string;

  @Prop({ type: String })
  resetToken: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
