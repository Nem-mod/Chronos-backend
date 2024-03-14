import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { TimezonteDto } from './dto/settings/timezonte.dto';
import { FullUserDto } from '../user/dto/user/full-user.dto';
import { OwnershipService } from '../user/ownership.service';
import { Ownership } from '../user/models/ownership.model';
import { CreateCalendarEntryDto } from './dto/calendar-entry/create-calendar-entry.dto';
import { FullCalendarEntryDto } from './dto/calendar-entry/full-calendar-entry.dto';
import { UpdateCalendarListDto } from './dto/calendar-list/update-calendar-list.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Timezone.name) private readonly timezoneModel: Model<Timezone>,
    @InjectModel(Calendar.name) private readonly calendarModel: Model<Calendar>,
    @InjectModel(CalendarEntry.name)
    private readonly calendarEntryModel: Model<CalendarEntry>,
    @InjectModel(CalendarList.name)
    private readonly calendarListModel: Model<CalendarList>,
    private readonly ownershipService: OwnershipService,
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

  async createCalendar(
    calendar: CreateCalendarDto,
    user: FullUserDto,
  ): Promise<FullCalendarDto> {
    const timezone: Timezone = await this.findTimezoneByCode(
      calendar.timezone as string,
    );
    if (!timezone) throw new NotFoundException(`Timezone not found`);

    const users: Ownership = await this.ownershipService.createOwnershipModel({
      owners: [user._id],
      guests: [],
    });
    const newCalendar: Calendar = new this.calendarModel({
      ...calendar,
      users,
    });
    await newCalendar.save();

    await this.addCalendarsToList({ calendars: [newCalendar._id] }, user);

    return newCalendar;
  }

  async createCalendarEntry(
    calendarEntry: CreateCalendarEntryDto,
  ): Promise<FullCalendarEntryDto> {
    const newCalendarEntry: CalendarEntry = new this.calendarEntryModel(
      calendarEntry,
    );
    await newCalendarEntry.save();

    return newCalendarEntry;
  }

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

  async findCalendarListByUser(user: FullUserDto): Promise<CalendarList> {
    return await this.calendarListModel.findById(user._id);
  }

  async addCalendarsToList(
    calendarIds: UpdateCalendarListDto,
    user: FullUserDto,
  ) {
    const calendarList: CalendarList = await this.findCalendarListByUser(user);

    for (const calendarId of calendarIds.calendars) {
      const calendarEntry: FullCalendarEntryDto =
        await this.createCalendarEntry({
          calendarId: calendarId as string,
        });

      calendarList.calendars.push(calendarEntry as CalendarEntry);
    }
    await calendarList.save();
  }

  async findTimezoneByCode(tzCode: TimezonteDto[`_id`]): Promise<Timezone> {
    return await this.timezoneModel.findById(tzCode);
  }
}
