import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Timezone } from '../timezone/models/timezone.model';
import { Model } from 'mongoose';
import { FullCalendarDto } from './dto/full-calendar.dto';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { Calendar } from './models/calendar.model';
import { OwnershipService } from '../../user/ownership/ownership.service';
import { Ownership } from '../../user/ownership/models/ownership.model';
import { TimezonesService } from '../timezone/timezones.service';
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

  async update(calendar: UpdateCalendarDto): Promise<FullCalendarDto> {
    delete calendar.users;

    await this.timezonesService.findTimezoneByCode(calendar.timezone as string);

    const updatedCalendar: Calendar =
      await this.calendarModel.findByIdAndUpdate(calendar._id, calendar, {
        new: true,
      });
    if (!updatedCalendar) throw new NotFoundException(`Calendar not found`);
    return updatedCalendar;
  }

  async addGuest(
    calendarId: CreateCalendarDto[`_id`],
    userId: CreateUserDto[`_id`],
  ): Promise<FullCalendarDto> {
    const calendar: FullCalendarDto = await this.findById(calendarId);

    calendar.users = await this.ownershipService.addGuest(
      calendar.users,
      userId,
    );

    return await this.update(calendar as UpdateCalendarDto);
  }

  async removeGuestOrOwner(
    calendarId: CreateCalendarDto[`_id`],
    userId: CreateUserDto[`_id`],
  ): Promise<FullCalendarDto> {
    const calendar: FullCalendarDto = await this.findById(calendarId);
    calendar.users = await this.ownershipService.removeGuestOrOwner(
      calendar.users,
      userId,
    );
    return await this.update(calendar as UpdateCalendarDto);
  }
}
