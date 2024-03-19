import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RecurrenceSettings } from '../../settings/recurrence/models/recurrence-settings.model';
import { TaskSettings } from '../../settings/task/models/task.settings';

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: TaskSettings, default: null })
  taskSettings: TaskSettings;

  @Prop({ required: true })
  isAllDay: boolean;

  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;

  @Prop({ type: RecurrenceSettings, default: null })
  recurrenceSettings: RecurrenceSettings;
}

export const EventSchema = SchemaFactory.createForClass(Event);
