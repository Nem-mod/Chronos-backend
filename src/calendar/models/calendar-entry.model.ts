import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Calendar } from './calendar.model';
import { RemindSettings } from './settings/remind-settings.model';
import { VisibilitySettings } from './settings/visibility-settings.model';

@Schema()
export class CalendarEntry extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Calendar.name })
  calendarId: Calendar;

  @Prop({ type: RemindSettings })
  remindSetting: RemindSettings;

  @Prop({ type: VisibilitySettings })
  visibilitySetting: VisibilitySettings;
}

export const CalendarEntrySchema = SchemaFactory.createForClass(CalendarEntry);
