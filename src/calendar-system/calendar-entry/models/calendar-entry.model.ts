import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Calendar } from '../../calendar/models/calendar.model';
import { RemindSettings } from '../../settings/remind/models/remind-settings.model';
import { VisibilitySettings } from '../../settings/visibility/models/visibility-settings.model';

@Schema()
export class CalendarEntry extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Calendar.name,
    index: true,
    required: true,
  })
  calendar: Calendar;

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
