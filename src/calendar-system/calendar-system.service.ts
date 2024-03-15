import { Injectable } from '@nestjs/common';
import { CalendarService } from './calendar/calendar.service';
import { CalendarEntryService } from './calendar-entry/calendar-entry.service';
import { CalendarListService } from './calendar-list/calendar-list.service';
import { CreateCalendarDto } from './calendar/dto/create-calendar.dto';
import { FullCalendarDto } from './calendar/dto/full-calendar.dto';
import { FullUserDto } from '../user/dto/full-user.dto';
import { TimezonesService } from './calendar/timezone/timezones.service';

@Injectable()
export class CalendarSystemService {
  constructor(
    private readonly timezoneService: TimezonesService,
    private readonly calendarService: CalendarService,
    private readonly calendarEntryService: CalendarEntryService,
    private readonly calendarListService: CalendarListService,
  ) {}

  async createOwnCalendar(
    calendar: CreateCalendarDto,
    user: FullUserDto,
  ): Promise<FullCalendarDto> {
    const newCalendar = await this.calendarService.create(calendar, user);
    const calendarEntry = await this.calendarEntryService.createCalendarEntry({
      calendarId: newCalendar._id,
    });
    await this.calendarListService.addCalendarEntryToList(calendarEntry, user);

    return newCalendar;
  }

  async initCalendarList(user: FullUserDto) {
    return await this.calendarListService.createCalendarList({ _id: user._id });
  }

  async initTimezoneDatabase() {
    await this.timezoneService.fillTimezoneDatabase();
  }

  async deleteCalendar(calendarId: CreateCalendarDto[`_id`]) {
    await this.calendarService.delete(calendarId);
    await this.calendarEntryService.deleteAllCalendarEntries(calendarId);
  }
}
