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
import { FullCalendarDto } from '../calendar/dto/full-calendar.dto';

@Injectable()
export class CalendarListService {
  constructor(
    @InjectModel(CalendarList.name)
    private readonly calendarListModel: Model<CalendarList>,
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

  async findCalendarListById(
    listId: CreateCalendarListDto[`_id`],
  ): Promise<CalendarList> {
    const calendarList: CalendarList =
      await this.calendarListModel.findById(listId);
    if (!calendarList) throw new NotFoundException(`Calendar list not found`);
    return calendarList;
  }

  async getAllCalendarsFromList(
    listId: CreateCalendarListDto[`_id`],
  ): Promise<FullCalendarListDto> {
    return (await this.findCalendarListById(listId)).populate({
      path: `calendarEntries`,
      populate: {
        path: `calendar`,
      },
    });
  }

  async getCalendarEntryByCalendar(
    listId: CreateCalendarListDto[`_id`],
    calendarId: CreateCalendarDto[`_id`],
  ): Promise<FullCalendarEntryDto> {
    const calendarList: FullCalendarListDto = (await (
      await this.findCalendarListById(listId)
    ).populate({ path: `calendarEntries` })) as FullCalendarListDto;

    return calendarList.calendarEntries.find(
      (calendarEntry: FullCalendarEntryDto) =>
        calendarEntry.calendar.toString() === calendarId.toString(),
    ) as FullCalendarEntryDto;
  }

  async containsCalendarEntry(
    listId: CreateCalendarListDto[`_id`],
    calendarEntryId: CreateCalendarEntryDto[`_id`],
  ): Promise<boolean> {
    const calendarList: FullCalendarListDto =
      await this.findCalendarListById(listId);
    return calendarList.calendarEntries.some(
      (obj: string | FullCalendarEntryDto) => {
        let id: string;
        if (obj instanceof FullCalendarEntryDto) {
          id = obj._id.toString();
        } else {
          id = obj.toString();
        }
        return id === calendarEntryId.toString();
      },
    );
  }

  async containsCalendar(
    listId: CreateCalendarListDto[`_id`],
    calendatrId: CreateCalendarDto[`_id`],
  ): Promise<boolean> {
    const calendarList: FullCalendarListDto = (await (
      await this.findCalendarListById(listId)
    ).populate({ path: `calendarEntries` })) as FullCalendarListDto;

    return calendarList.calendarEntries.some(
      (obj) => obj.calendar.toString() === calendatrId.toString(),
    );
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
    let calendarList: CalendarList;
    try {
      calendarList = await this.findCalendarListById(userId);
    } catch (err) {
      await this.createCalendarList({ _id: userId });
      calendarList = await this.findCalendarListById(userId);
    } // TODO: maybe move to another function like findCalendarListByIdOrCreate

    for (const calendarEntry of calendarEntryIds.calendarEntries) {
      calendarList.calendarEntries.push(calendarEntry as CalendarEntry);
    }
    await calendarList.save();
  }

  async clearListFromTombstones(listId: CreateCalendarListDto[`_id`]) {
    const calendarList: CalendarList = await this.findCalendarListById(listId);
    const calendarListPopulated: CalendarList = await (
      await this.findCalendarListById(listId)
    ).populate({
      path: `calendarEntries`,
    });

    calendarList.calendarEntries = calendarListPopulated.calendarEntries;

    await calendarList.save();
  }
}
