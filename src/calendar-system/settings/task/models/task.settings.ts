import { Document } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

export class TaskSettings extends Document {
  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ type: String, enum: PriorityEnum })
  priority: PriorityEnum;
}
