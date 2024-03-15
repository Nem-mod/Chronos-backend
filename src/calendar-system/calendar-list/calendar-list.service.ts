import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { CalendarService } from '../calendar/calendar.service';

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

  async findCalendarListByUser(
    userId: CreateUserDto[`_id`],
  ): Promise<CalendarList> {
    const calendarList: CalendarList =
      await this.calendarListModel.findById(userId);
    if (!calendarList) throw new NotFoundException(`Calendar list not found`);
    return calendarList;
  }

  async addCalendarEntryToList(
    calendarEntry: FullCalendarEntryDto,
    userId: CreateUserDto[`_id`],
  ) {
    await this.addCalendarEntriesToList(
      { calendarEntries: [calendarEntry] },
      userId,
    );
  }

  async addCalendarEntriesToList(
    calendarEntryIds: UpdateCalendarListDto,
    userId: CreateUserDto[`_id`],
  ) {
    const calendarList: CalendarList =
      await this.findCalendarListByUser(userId);

    for (const calendarEntry of calendarEntryIds.calendarEntries) {
      calendarList.calendarEntries.push(calendarEntry as CalendarEntry);
    }
    await calendarList.save();
  }

  async clearListFromTombstones(userId: CreateUserDto[`_id`]) {
    const calendarList: CalendarList =
      await this.findCalendarListByUser(userId);
    const calendarListPopulated: CalendarList = await (
      await this.findCalendarListByUser(userId)
    ).populate({
      path: `calendarEntries`,
    });

    calendarList.calendarEntries = calendarListPopulated.calendarEntries;

    await calendarList.save();
  }
}
