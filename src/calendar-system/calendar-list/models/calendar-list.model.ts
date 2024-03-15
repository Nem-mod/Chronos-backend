import mongoose, { Document } from 'mongoose';
import { User } from '../../../user/models/user.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CalendarEntry } from '../../calendar-entry/models/calendar-entry.model';

@Schema()
export class CalendarList extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  _id: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: CalendarEntry.name }],
    default: [],
  })
  calendars: CalendarEntry[];
}

export const CalendarListSchema = SchemaFactory.createForClass(CalendarList);
