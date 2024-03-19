import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PriorityEnum } from '../enums/priority.enum';

@Schema()
export class TaskSettings extends Document {
  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ type: String, enum: PriorityEnum, default: PriorityEnum.HIGH })
  priority: PriorityEnum;
}

export const TaskSettingsSchema = SchemaFactory.createForClass(TaskSettings);
