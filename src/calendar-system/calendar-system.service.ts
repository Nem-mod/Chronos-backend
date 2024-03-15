import { Injectable } from '@nestjs/common';
import { CalendarService } from './calendar/calendar.service';
import { CalendarEntryService } from './calendar-entry/calendar-entry.service';
import { CalendarListService } from './calendar-list/calendar-list.service';
import { CreateCalendarDto } from './calendar/dto/create-calendar.dto';
import { FullCalendarDto } from './calendar/dto/full-calendar.dto';
import { FullUserDto } from '../user/dto/full-user.dto';
import { TimezonesService } from './calendar/timezone/timezones.service';
import { FullCalendarListDto } from './calendar-list/dto/full-calendar-list.dto';
import { FullCalendarEntryDto } from './calendar-entry/dto/full-calendar-entry.dto';
import { OwnershipService } from '../user/ownership/ownership.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class CalendarSystemService {
  constructor(
    private readonly timezoneService: TimezonesService,
    private readonly ownershipService: OwnershipService,
    private readonly calendarService: CalendarService,
    private readonly calendarEntryService: CalendarEntryService,
    private readonly calendarListService: CalendarListService,
  ) {}

  async createOwnCalendar(
    calendar: CreateCalendarDto,
    userId: CreateUserDto[`_id`],
  ): Promise<FullCalendarDto> {
    const newCalendar: FullCalendarDto = await this.calendarService.create(
      calendar,
      userId,
    );
    const calendarEntry: FullCalendarEntryDto =
      await this.calendarEntryService.createCalendarEntry({
        calendarId: newCalendar._id,
      });
    await this.calendarListService.addCalendarEntryToList(
      calendarEntry,
      userId,
    );

    return newCalendar;
  }

  async initCalendarList(user: FullUserDto): Promise<FullCalendarListDto> {
    return await this.calendarListService.createCalendarList({ _id: user._id });
  }

  async initTimezoneDatabase(): Promise<void> {
    await this.timezoneService.fillTimezoneDatabase();
  }

  async deleteCalendar(calendarId: CreateCalendarDto[`_id`]): Promise<void> {
    const calendar: FullCalendarDto =
      await this.calendarService.delete(calendarId);
    const allCalendarUserIds: CreateUserDto[`_id`][] =
      await this.ownershipService.getAllUsersIds(calendar.users);

    await this.calendarEntryService.deleteAllCalendarEntries(calendarId);

    for (const userId of allCalendarUserIds)
      await this.calendarListService.clearListFromTombstones(userId);
  }
}
