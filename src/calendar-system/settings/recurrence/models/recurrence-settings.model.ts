import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class RecurrenceSettings extends Document {
  @Prop({ type: String, enum: FrequencyEnum, required: true })
  frequency: FrequencyEnum;

  @Prop({ required: true })
  interval: number;

  @Prop({ required: true })
  isNeverStop: boolean;

  @Prop({ required: true })
  count: number;

  @Prop({ type: Date, required: true })
  until: Date;

  @Prop({ default: [] })
  byHour: number[];

  @Prop({ default: [] })
  byDay: number[];

  @Prop({ default: [] })
  byMonth: number[];

  @Prop({ default: [] })
  byYear: number[];

  @Prop({ type: [Date], default: [] })
  additionalDates: Date[];

  @Prop({ type: [Date], default: [] })
  exceptionDates: Date[];
}

export const RecurrenceSettingsSchema =
  SchemaFactory.createForClass(RecurrenceSettings);
