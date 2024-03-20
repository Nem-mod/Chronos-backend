import { Module } from '@nestjs/common';
import { CalendarSystemController } from './calendar-system.controller';
import { CalendarService } from './calendar/calendar.service';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Timezone, TimezoneSchema } from './timezone/models/timezone.model';
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
} from './settings/remind/models/remind-settings.model';
import {
  VisibilitySettings,
  VisibilitySettingsSchema,
} from './settings/visibility/models/visibility-settings.model';
import { RemindSettingsService } from './settings/remind/remind-settings.service';
import { VisibilitySettingsService } from './settings/visibility/visibility-settings.service';
import { TimezonesService } from './timezone/timezones.service';
import { CalendarEntryService } from './calendar-entry/calendar-entry.service';
import { CalendarListService } from './calendar-list/calendar-list.service';
import { CalendarSystemService } from './calendar-system.service';
import { CalendarOwnerGuard } from './calendar/guards/calendar-owner.guard';
import { CalendarEntryOwnerGuard } from './calendar-entry/guards/calendar-entry-owner.guard';
import { EventController } from './event/event.controller';
import { EventService } from './event/event.service';
import { RecurrenceSettingsService } from './settings/recurrence/recurrence-settings.service';
import { TaskSettingsService } from './settings/task/task-settings.service';
import {
  TaskSettings,
  TaskSettingsSchema,
} from './settings/task/models/task.settings.model';
import {
  RecurrenceSettings,
  RecurrenceSettingsSchema,
} from './settings/recurrence/models/recurrence-settings.model';
import { Event, EventSchema } from './event/models/event.model';
import { EventOwnerGuard } from './event/guards/event-owner.guard';
import { CalendarMemberGuard } from './calendar/guards/calendar-member.guard';
import { EventMemberGuard } from './event/guards/event-member.guard';

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
      { name: TaskSettings.name, schema: TaskSettingsSchema },
      { name: RecurrenceSettings.name, schema: RecurrenceSettingsSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [CalendarSystemController, EventController],
  providers: [
    CalendarService,
    RemindSettingsService,
    VisibilitySettingsService,
    TimezonesService,
    CalendarEntryService,
    CalendarListService,
    CalendarSystemService,
    CalendarOwnerGuard,
    CalendarEntryOwnerGuard,
    EventService,
    RecurrenceSettingsService,
    TaskSettingsService,
    EventOwnerGuard,
    CalendarMemberGuard,
    EventMemberGuard,
  ],
  exports: [CalendarSystemService, EventService],
})
export class CalendarSystemModule {}
