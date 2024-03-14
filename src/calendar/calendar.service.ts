import { ConflictException, Injectable } from '@nestjs/common';
import timezones from 'timezones-list';
import { InjectModel } from '@nestjs/mongoose';
import { Timezone } from './models/settings/timezone.model';
import { Model } from 'mongoose';
import { FullCalendarDto } from './dto/calendar/full-calendar.dto';
import { CreateCalendarDto } from './dto/calendar/create-calendar.dto';
import { Calendar } from './models/calendar.model';
import { CreateUserDto } from '../user/dto/user/create-user.dto';
import { CalendarList } from './models/calendar-list.model';
import { CalendarEntry } from './models/calendar-entry.model';
import { FullCalendarListDto } from './dto/calendar-list/full-calendar-list.dto';
import { CreateCalendarListDto } from './dto/calendar-list/create-calendar-list.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Timezone.name) private readonly timezoneModel: Model<Timezone>,
    @InjectModel(Calendar.name) private readonly calendarModel: Model<Calendar>,
    @InjectModel(CalendarEntry.name)
    private readonly calendarEntryModel: Model<CalendarEntry>,
    @InjectModel(CalendarList.name)
    private readonly calendarListModel: Model<CalendarList>,
  ) {}

  async fillTimezoneDatabase(): Promise<void> {
    try {
      for (const tz of timezones) {
        await new this.timezoneModel({ _id: tz.tzCode, ...tz }).save();
      }
    } catch (err) {
      if (err.code === 11000)
        throw new ConflictException(`Timezones are already filled`);
      console.error(err);
      throw err;
    }
  }

  // async createCalendar(calendar: CreateCalendarDto): Promise<FullCalendarDto> {
  //   const newCalendar = new this.calendarModel(calendar);
  //
  //   await newCalendar.save();
  //
  //   return newCalendar;
  // }

  async createCalendarList(
    calendarList: CreateCalendarListDto,
  ): Promise<FullCalendarListDto> {
    const newCalendarList: CalendarList = new this.calendarListModel(
      calendarList,
    );

    try {
      await newCalendarList.save();
    } catch (err) {
      if (err.code === 11000)
        throw new ConflictException(
          `Calendar list already exists for this user`,
        );
      console.error(err);
      throw err;
    }

    return newCalendarList;
  }
}
