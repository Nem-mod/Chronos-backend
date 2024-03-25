import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { SendLinkDto } from '../../user/email-send/dto/send-link.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UserService } from '../../user/user.service';
import { EmailSendService } from '../../user/email-send/email-send.service';
import { EventInvitePayloadDto } from './dto/event-invite-payload.dto';
import { ConfigService } from '@nestjs/config';
import { CalendarInvitePayloadDto } from '../calendar/dto/calendar-invite-payload.dto';
import { FullCalendarDto } from '../calendar/dto/full-calendar.dto';
import { CalendarService } from '../calendar/calendar.service';
import { EventInviteInfoDto } from './dto/event-invite-info.dto';

@Injectable()
export class EventService {
  private expiredInviteTokens: Set<string> = new Set();

  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    private readonly timezonesService: TimezonesService,
    private readonly taskSettingsService: TaskSettingsService,
    private readonly recurrenceSettingsService: RecurrenceSettingsService,
    private readonly userService: UserService,
    private readonly emailSendService: EmailSendService,
    private readonly configService: ConfigService,
    private readonly calendarService: CalendarService,
  ) {}

  async create(event: CreateEventDto): Promise<FullEventDto> {
    delete event._id; // TODO: delete _id in every create function

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
      .populate(`calendar`)
      .lean();
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
  }

  async sendShareInvitation(
    inviteInfo: EventInviteInfoDto,
    senderName: CreateUserDto[`username`],
  ) {
    const user = await this.userService.findByUsername(inviteInfo.username);
    const event = await this.findById(inviteInfo.event as string);

    inviteInfo.returnUrl = await this.emailSendService.prepareLink(
      {
        userId: user._id,
        eventId: event._id,
      } as EventInvitePayloadDto,
      inviteInfo,
      this.configService.get(`jwt.eventInvite`),
      `inviteToken`,
    );

    await this.emailSendService.sendEmail(
      user.email,
      this.configService.get(`api.sendgrid.event-invitation-template`),
      {
        eventName: event.name,
        ownerName: senderName,
        link: inviteInfo.returnUrl,
      },
    );
  }

  async validateShareInvitation(
    userId: CreateUserDto[`_id`],
    calendarId: CreateCalendarDto[`_id`],
    token: string,
  ) {
    const payload: EventInvitePayloadDto =
      await this.emailSendService.validateTokenFromEmail(
        token,
        this.configService.get(`jwt.eventInvite`),
      );

    if (userId.toString() !== payload.userId.toString())
      throw new ForbiddenException(`This invitation isn't for you`);
    if (this.expiredInviteTokens.has(token))
      throw new UnauthorizedException(`This invitation has expired`);

    // TODO: Check for event dublicates here

    const event: CreateEventDto = await this.findById(payload.eventId);
    const calendar: FullCalendarDto =
      await this.calendarService.findById(calendarId);

    this.expiredInviteTokens.add(token);

    return await this.create({
      ...event,
      calendar: calendar._id,
      parentEvent: event._id,
    });
  }
}
