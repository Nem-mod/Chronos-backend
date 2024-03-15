import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Timezone } from './timezone/models/timezone.model';
import { Model } from 'mongoose';
import { FullCalendarDto } from './dto/full-calendar.dto';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { Calendar } from './models/calendar.model';
import { CalendarList } from '../calendar-list/models/calendar-list.model';
import { CalendarEntry } from '../calendar-entry/models/calendar-entry.model';
import { FullCalendarListDto } from '../calendar-list/dto/full-calendar-list.dto';
import { CreateCalendarListDto } from '../calendar-list/dto/create-calendar-list.dto';
import { FullUserDto } from '../../user/dto/user/full-user.dto';
import { OwnershipService } from '../../user/ownership.service';
import { Ownership } from '../../user/models/ownership.model';
import { CreateCalendarEntryDto } from '../calendar-entry/dto/create-calendar-entry.dto';
import { FullCalendarEntryDto } from '../calendar-entry/dto/full-calendar-entry.dto';
import { UpdateCalendarListDto } from '../calendar-list/dto/update-calendar-list.dto';
import { RemindSettingsDto } from '../calendar-entry/remind-settings/dto/remind-settings.dto';
import { RemindSettings } from '../calendar-entry/remind-settings/models/remind-settings.model';
import { VisibilitySettings } from '../calendar-entry/visibility-settings/models/visibility-settings.model';
import { VisibilitySettingsDto } from '../calendar-entry/visibility-settings/dto/visibility-settings.dto';
import { TimezonesService } from './timezone/timezones.service';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Calendar.name) private readonly calendarModel: Model<Calendar>,
    @InjectModel(CalendarEntry.name)
    private readonly calendarEntryModel: Model<CalendarEntry>,
    @InjectModel(CalendarList.name)
    private readonly calendarListModel: Model<CalendarList>,
    @InjectModel(RemindSettings.name)
    private readonly remindSettingsModel: Model<RemindSettings>,
    @InjectModel(VisibilitySettings.name)
    private readonly visibilitySettingsModel: Model<VisibilitySettings>,
    private readonly ownershipService: OwnershipService,
    private readonly timezonesService: TimezonesService,
  ) {}

  async createCalendar(
    calendar: CreateCalendarDto,
    user: FullUserDto,
  ): Promise<FullCalendarDto> {
    const timezone: Timezone = await this.timezonesService.findTimezoneByCode(
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

    await this.addCalendarToList(newCalendar._id, user);

    return newCalendar;
  }

  async createRemindSettingsModel(
    remindSettings: RemindSettingsDto,
  ): Promise<RemindSettings> {
    return new this.remindSettingsModel(remindSettings);
  }

  async createVisibilitySettingsModel(
    visibilitySettings: VisibilitySettingsDto,
  ): Promise<VisibilitySettings> {
    return new this.visibilitySettingsModel(visibilitySettings);
  }

  async createCalendarEntry(
    calendarEntry: CreateCalendarEntryDto,
  ): Promise<FullCalendarEntryDto> {
    const remindSettings: RemindSettings = await this.createRemindSettingsModel(
      calendarEntry.remindSettings,
    );
    const visibilitySettings: VisibilitySettings =
      await this.createVisibilitySettingsModel(
        calendarEntry.visibilitySettings,
      );
    const newCalendarEntry: CalendarEntry = new this.calendarEntryModel({
      ...calendarEntry,
      remindSettings,
      visibilitySettings,
    });
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

  async addCalendarToList(
    calendarId: CreateCalendarDto[`_id`],
    user: FullUserDto,
  ) {
    await this.addCalendarsToList({ calendars: [calendarId] }, user);
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
}
