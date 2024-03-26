import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CalendarEntry } from './models/calendar-entry.model';
import { Model } from 'mongoose';
import { CreateCalendarEntryDto } from './dto/create-calendar-entry.dto';
import { FullCalendarEntryDto } from './dto/full-calendar-entry.dto';
import { RemindSettings } from '../settings/remind/models/remind-settings.model';
import { VisibilitySettings } from '../settings/visibility/models/visibility-settings.model';
import { UpdateCalendarEntryDto } from './dto/update-calendar-entry.dto';
import { VisibilitySettingsService } from '../settings/visibility/visibility-settings.service';
import { RemindSettingsService } from '../settings/remind/remind-settings.service';
import { UpdateCalendarDto } from '../calendar/dto/update-calendar.dto';

@Injectable()
export class CalendarEntryService {
  constructor(
    @InjectModel(CalendarEntry.name)
    private readonly calendarEntryModel: Model<CalendarEntry>,
    private readonly visibilitySettingsService: VisibilitySettingsService,
    private readonly remindSettingsService: RemindSettingsService,
  ) {}

  async createCalendarEntry(
    calendarEntry: CreateCalendarEntryDto,
  ): Promise<FullCalendarEntryDto> {
    const remindSettings: RemindSettings =
      await this.remindSettingsService.createDefaultModel();
    const visibilitySettings: VisibilitySettings =
      await this.visibilitySettingsService.createDefaultModel();
    const newCalendarEntry: CalendarEntry = new this.calendarEntryModel({
      ...calendarEntry,
      remindSettings,
      visibilitySettings,
    });
    await newCalendarEntry.save();

    return newCalendarEntry;
  }

  async findById(id: CreateCalendarEntryDto[`_id`]): Promise<CalendarEntry> {
    const calendarEntry: CalendarEntry =
      await this.calendarEntryModel.findById(id);
    if (!calendarEntry) throw new NotFoundException(`Calendar entry not found`);
    return calendarEntry;
  }

  async update(
    calendarEntry: UpdateCalendarEntryDto,
  ): Promise<FullCalendarEntryDto> {
    const remindSettings: RemindSettings =
      await this.remindSettingsService.createModel(
        calendarEntry.remindSettings,
      );
    const visibilitySettings: VisibilitySettings =
      await this.visibilitySettingsService.createModel(
        calendarEntry.visibilitySettings,
      );

    const newCalendarEntry: CalendarEntry =
      await this.calendarEntryModel.findByIdAndUpdate(
        calendarEntry._id,
        { ...calendarEntry, remindSettings, visibilitySettings },
        { new: true },
      );
    if (!newCalendarEntry)
      throw new NotFoundException(`Calendar entry not found`);
    return newCalendarEntry;
  }

  async delete(id: CreateCalendarEntryDto[`_id`]): Promise<CalendarEntry> {
    const calendarEntry: CalendarEntry =
      await this.calendarEntryModel.findByIdAndDelete(id);
    if (!calendarEntry) throw new NotFoundException(`Calendar entry not found`);
    return calendarEntry;
  }

  async deleteAllCalendarEntries(calendar: CreateCalendarEntryDto[`calendar`]) {
    return await this.calendarEntryModel.deleteMany({ calendar });
  }
}
