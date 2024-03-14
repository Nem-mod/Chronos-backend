import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class RemindSettings extends Document {
  @Prop({ type: [Number], default: [] })
  secondsBefore: number[];
}

export const RemindSettingSchema = SchemaFactory.createForClass(RemindSettings);
