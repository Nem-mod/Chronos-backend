import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CalendarEntry } from './models/calendar-entry.model';
import { Model } from 'mongoose';
import { CreateCalendarEntryDto } from './dto/create-calendar-entry.dto';
import { FullCalendarEntryDto } from './dto/full-calendar-entry.dto';
import { RemindSettings } from './remind-settings/models/remind-settings.model';
import { VisibilitySettings } from './visibility-settings/models/visibility-settings.model';
import { RemindSettingsDto } from './remind-settings/dto/remind-settings.dto';
import { VisibilitySettingsDto } from './visibility-settings/dto/visibility-settings.dto';
import { UpdateCalendarEntryDto } from './dto/update-calendar-entry.dto';

@Injectable()
export class CalendarEntryService {
  constructor(
    @InjectModel(CalendarEntry.name)
    private readonly calendarEntryModel: Model<CalendarEntry>,
    @InjectModel(RemindSettings.name)
    private readonly remindSettingsModel: Model<RemindSettings>,
    @InjectModel(VisibilitySettings.name)
    private readonly visibilitySettingsModel: Model<VisibilitySettings>,
  ) {}

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

  async findById(id: CreateCalendarEntryDto[`_id`]): Promise<CalendarEntry> {
    const calendarEntry: CalendarEntry =
      await this.calendarEntryModel.findById(id);
    if (!calendarEntry) throw new NotFoundException(`Calendar entry not found`);
    return calendarEntry;
  }

  async update(
    calendarEntry: UpdateCalendarEntryDto,
  ): Promise<FullCalendarEntryDto> {
    const newCalendarEntry: CalendarEntry =
      await this.calendarEntryModel.findByIdAndUpdate(
        calendarEntry._id,
        calendarEntry,
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
