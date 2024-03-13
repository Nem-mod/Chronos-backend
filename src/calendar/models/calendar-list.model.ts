import mongoose, { Document } from 'mongoose';
import { User } from '../../user/models/user.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CalendarList extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: User;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: `CalendarEntry` }], default: [] })
  // calendars: CalendarEntry
}

export const CalendarListSchema = SchemaFactory.createForClass(CalendarList);
