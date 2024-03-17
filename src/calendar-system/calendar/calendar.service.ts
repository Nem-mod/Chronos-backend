import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Timezone } from './timezone/models/timezone.model';
import { Model } from 'mongoose';
import { FullCalendarDto } from './dto/full-calendar.dto';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { Calendar } from './models/calendar.model';
import { FullUserDto } from '../../user/dto/full-user.dto';
import { OwnershipService } from '../../user/ownership/ownership.service';
import { Ownership } from '../../user/ownership/models/ownership.model';
import { TimezonesService } from './timezone/timezones.service';
import { CalendarEntryService } from '../calendar-entry/calendar-entry.service';
import { CalendarListService } from '../calendar-list/calendar-list.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Calendar.name) private readonly calendarModel: Model<Calendar>,

    private readonly ownershipService: OwnershipService,
    private readonly timezonesService: TimezonesService,
  ) {}

  async create(
    calendar: CreateCalendarDto,
    userId: CreateUserDto[`_id`],
  ): Promise<FullCalendarDto> {
    await this.timezonesService.findTimezoneByCode(calendar.timezone as string);

    const users: Ownership = await this.ownershipService.createOwnershipModel({
      owners: [userId],
      guests: [],
    });
    const newCalendar: Calendar = new this.calendarModel({
      ...calendar,
      users,
    });
    await newCalendar.save();

    return newCalendar;
  }

  async findById(id: CreateCalendarDto[`_id`]): Promise<Calendar> {
    const calendar: Calendar = await this.calendarModel.findById(id);
    if (!calendar) throw new NotFoundException(`Calendar not found`);
    return calendar;
  }

  async delete(id: CreateCalendarDto[`_id`]): Promise<FullCalendarDto> {
    const calendar: Calendar = await this.calendarModel.findByIdAndDelete(id);
    if (!calendar) throw new NotFoundException(`Calendar not found`);
    return calendar;
  }

  async update(
    id: CreateCalendarDto[`_id`],
    calendar: UpdateCalendarDto,
  ): Promise<FullCalendarDto> {
    delete calendar._id;
    delete calendar.users;

    await this.timezonesService.findTimezoneByCode(calendar.timezone as string);

    const updatedCalendar: Calendar =
      await this.calendarModel.findByIdAndUpdate(id, calendar, { new: true });
    if (!updatedCalendar) throw new NotFoundException(`Calendar not found`);
    return updatedCalendar;
  }
}
