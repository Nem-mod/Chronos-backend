import { Injectable, NotFoundException } from '@nestjs/common';
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
import { CreateCalendarDto } from '../calendar/dto/create-calendar.dto';

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

  async findById(id: CreateEventDto[`_id`]): Promise<Event> {
    const event: Event = await this.eventModel
      .findById(id)
      .populate(`calendar`);
    if (!event) throw new NotFoundException(`Event not found`);
    return event;
  }

  async findEventsByCalendar(
    calendarId: CreateCalendarDto[`_id`],
  ): Promise<Event[]> {
    const events: Event[] = await this.eventModel.find({
      calendar: calendarId,
    });
    if (!events || events.length === 0)
      throw new NotFoundException(`Events not found`);
    return events;
  }

  async delete(id: CreateEventDto[`_id`]): Promise<FullEventDto> {
    const event: Event = await this.eventModel.findByIdAndDelete(id);
    if (!event) throw new NotFoundException(`Event not found`);
    return event;
  } // TODO add parentEventId
}
