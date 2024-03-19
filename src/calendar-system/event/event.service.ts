import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { FullEventDto } from './dto/full-event.dto';
import { Event } from './models/event.model';
import { TimezonesService } from '../timezone/timezones.service';
import { TaskSettings } from '../settings/task/models/task.settings.model';
import { TaskSettingsService } from '../settings/task/task-settings.service';
import { RecurrenceSettings } from '../settings/recurrence/models/recurrence-settings.model';
import { RecurrenceSettingsService } from '../settings/recurrence/recurrence-settings.service';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    private readonly timezonesService: TimezonesService,
    private readonly taskSettingsService: TaskSettingsService,
    private readonly recurrenceSettingsService: RecurrenceSettingsService,
  ) {}

  async create(event: CreateEventDto): Promise<FullEventDto> {
    await this.timezonesService.findTimezoneByCode(event.timezone as string);
    const taskSettings = await this.taskSettingsService.createModel(
      event.taskSettings,
    );
    const recurrenceSettings = await this.recurrenceSettingsService.createModel(
      event.recurrenceSettings,
    );

    const newEvent: Event = new this.eventModel({
      ...event,
      taskSettings,
      recurrenceSettings,
    });
    await newEvent.save();
    return newEvent;
  }
}
