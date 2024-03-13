import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Timezone, TimezoneSchema } from './models/settings/timezone.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timezone.name, schema: TimezoneSchema },
    ]),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
