import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.model';
import mongoose from 'mongoose';

@Schema()
export class Ownership extends Document {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
    default: [],
  })
  owners: User[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
    default: [],
  })
  guests: User[];
}

export const OwnershipSchema = SchemaFactory.createForClass(Ownership);
