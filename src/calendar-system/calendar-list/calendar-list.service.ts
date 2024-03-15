import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCalendarListDto } from './dto/create-calendar-list.dto';
import { FullCalendarListDto } from './dto/full-calendar-list.dto';
import { CalendarList } from './models/calendar-list.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FullUserDto } from '../../user/dto/full-user.dto';
import { CreateCalendarDto } from '../calendar/dto/create-calendar.dto';
import { UpdateCalendarListDto } from './dto/update-calendar-list.dto';
import { FullCalendarEntryDto } from '../calendar-entry/dto/full-calendar-entry.dto';
import { CalendarEntry } from '../calendar-entry/models/calendar-entry.model';
import { CalendarEntryService } from '../calendar-entry/calendar-entry.service';
import { CreateCalendarEntryDto } from '../calendar-entry/dto/create-calendar-entry.dto';

@Injectable()
export class CalendarListService {
  constructor(
    @InjectModel(CalendarList.name)
    private readonly calendarListModel: Model<CalendarList>,
    private readonly calendarEntryService: CalendarEntryService,
  ) {}

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

  async addCalendarEntryToList(
    calendarEntry: FullCalendarEntryDto,
    user: FullUserDto,
  ) {
    await this.addCalendarEntriesToList(
      { calendarEntries: [calendarEntry] },
      user,
    );
  }

  async addCalendarEntriesToList(
    calendarEntryIds: UpdateCalendarListDto,
    user: FullUserDto,
  ) {
    const calendarList: CalendarList = await this.findCalendarListByUser(user);

    for (const calendarEntry of calendarEntryIds.calendarEntries) {
      calendarList.calendarEntries.push(calendarEntry as CalendarEntry);
    }
    await calendarList.save();
  }
}
