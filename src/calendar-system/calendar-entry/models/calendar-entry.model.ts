import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Calendar } from '../../calendar/models/calendar.model';
import { RemindSettings } from '../remind-settings/models/remind-settings.model';
import { VisibilitySettings } from '../visibility-settings/models/visibility-settings.model';

@Schema()
export class CalendarEntry extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Calendar.name,
    index: true,
    required: true,
  })
  calendarId: Calendar;

  @Prop({
    type: RemindSettings,
    required: true,
  })
  remindSettings: RemindSettings;

  @Prop({
    type: VisibilitySettings,
    required: true,
  })
  visibilitySettings: VisibilitySettings;
}

export const CalendarEntrySchema = SchemaFactory.createForClass(CalendarEntry);
