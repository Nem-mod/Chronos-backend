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
    const timezone: Timezone = await this.timezonesService.findTimezoneByCode(
      calendar.timezone as string,
    );
    if (!timezone) throw new NotFoundException(`Timezone not found`);

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
}
