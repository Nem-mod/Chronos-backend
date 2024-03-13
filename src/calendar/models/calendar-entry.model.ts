import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Calendar } from './calendar.model';
import { RemindSetting } from './settings/remind-setting.model';
import { VisibilitySetting } from './settings/visibility-setting.model';

@Schema()
export class CalendarEntry extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Calendar.name })
  calendarId: Calendar;

  @Prop({ type: RemindSetting })
  remindSetting: RemindSetting;

  @Prop({ type: VisibilitySetting })
  visibilitySetting: VisibilitySetting;
}

export const CalendarEntrySchema = SchemaFactory.createForClass(CalendarEntry);
