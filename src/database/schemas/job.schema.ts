import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobDocument = Job & Document;

@Schema()
export class Job {
  _id: Types.ObjectId;

  @Prop({ type: String })
  jobId: string;

  @Prop({ type: String })
  input: string;

  @Prop({ type: String })
  output: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
