import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Timezone } from './settings/timezone.model';
import { Ownership } from '../../user/models/ownership.model';

@Schema()
export class Calendar extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Timezone.name,
    required: true,
  })
  timezone: Timezone;

  @Prop({
    type: Ownership,
    required: true,
  })
  users: Ownership;
}

export const CalendarSchema = SchemaFactory.createForClass(Calendar);
