import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class VisibilitySettings extends Document {
  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ default: null })
  color: string;

  @Prop({ default: null })
  name: string;
}

export const VisibilitySettingSchema =
  SchemaFactory.createForClass(VisibilitySettings);
