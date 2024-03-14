import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Timezone, TimezoneSchema } from './models/settings/timezone.model';
import { UserModule } from '../user/user.module';
import { Calendar, CalendarSchema } from './models/calendar.model';
import { CalendarList, CalendarListSchema } from './models/calendar-list.model';
import {
  CalendarEntry,
  CalendarEntrySchema,
} from './models/calendar-entry.model';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Timezone.name, schema: TimezoneSchema },
      { name: Calendar.name, schema: CalendarSchema },
      { name: CalendarEntry.name, schema: CalendarEntrySchema },
      { name: CalendarList.name, schema: CalendarListSchema },
    ]),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
