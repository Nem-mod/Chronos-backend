import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaType, SchemaTypes } from 'mongoose';

@Schema()
export class Timezone extends Document {
  @Prop()
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  utc: string;
}

export const TimezoneSchema = SchemaFactory.createForClass(Timezone);
