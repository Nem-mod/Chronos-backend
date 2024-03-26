import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RecurrenceSettings } from '../../settings/recurrence/models/recurrence-settings.model';
import { TaskSettings } from '../../settings/task/models/task.settings.model';
import { Timezone } from '../../timezone/models/timezone.model';
import { Calendar } from '../../calendar/models/calendar.model';

@Schema()
export class Event extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Event.name,
    default: null,
  })
  parentEvent: Event;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Calendar.name,
    required: true,
  })
  calendar: Calendar;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: TaskSettings, required: true })
  taskSettings: TaskSettings;

  @Prop({ required: true })
  isAllDay: boolean;

  @Prop({
    type: String,
    ref: Timezone.name,
    required: true,
  })
  timezone: Timezone;

  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;

  @Prop({ type: RecurrenceSettings, required: true })
  recurrenceSettings: RecurrenceSettings;
}

export const EventSchema = SchemaFactory.createForClass(Event);
