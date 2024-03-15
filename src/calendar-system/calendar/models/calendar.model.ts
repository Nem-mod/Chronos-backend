import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Timezone } from '../timezone/models/timezone.model';
import { Ownership } from '../../../user/models/ownership.model';
import { IsOptional, IsString } from 'class-validator';

@Schema()
export class Calendar extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({
    type: String,
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
