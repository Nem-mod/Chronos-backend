import { Module } from '@nestjs/common';
import { CalendarSystemController } from './calendar-system.controller';
import { CalendarService } from './calendar/calendar.service';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Timezone,
  TimezoneSchema,
} from './calendar/timezone/models/timezone.model';
import { UserModule } from '../user/user.module';
import { Calendar, CalendarSchema } from './calendar/models/calendar.model';
import {
  CalendarList,
  CalendarListSchema,
} from './calendar-list/models/calendar-list.model';
import {
  CalendarEntry,
  CalendarEntrySchema,
} from './calendar-entry/models/calendar-entry.model';
import {
  RemindSettings,
  RemindSettingsSchema,
} from './calendar-entry/remind-settings/models/remind-settings.model';
import {
  VisibilitySettings,
  VisibilitySettingsSchema,
} from './calendar-entry/visibility-settings/models/visibility-settings.model';
import { RemindSettingsService } from './calendar-entry/remind-settings/remind-settings.service';
import { VisibilitySettingsService } from './calendar-entry/visibility-settings/visibility-settings.service';
import { TimezonesService } from './calendar/timezone/timezones.service';
import { CalendarEntryService } from './calendar-entry/calendar-entry.service';
import { CalendarListService } from './calendar-list/calendar-list.service';
import { CalendarSystemService } from './calendar-system.service';
import { CalendarOwnerGuard } from './calendar/guards/calendar-owner.guard';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Timezone.name, schema: TimezoneSchema },
      { name: RemindSettings.name, schema: RemindSettingsSchema },
      { name: VisibilitySettings.name, schema: VisibilitySettingsSchema },
      { name: Calendar.name, schema: CalendarSchema },
      { name: CalendarEntry.name, schema: CalendarEntrySchema },
      { name: CalendarList.name, schema: CalendarListSchema },
    ]),
  ],
  controllers: [CalendarSystemController],
  providers: [
    CalendarService,
    RemindSettingsService,
    VisibilitySettingsService,
    TimezonesService,
    CalendarEntryService,
    CalendarListService,
    CalendarSystemService,
    CalendarOwnerGuard,
  ],
  exports: [CalendarSystemService],
})
export class CalendarSystemModule {}
