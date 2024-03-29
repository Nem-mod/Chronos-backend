import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  ImATeapotException,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt-auth.guard';
import { CalendarOwnerGuard } from './calendar/guards/calendar-owner.guard';
import { Request as RequestType } from 'express';
import { CreateEventDto } from './event/dto/create-event.dto';
import { EventService } from './event/event.service';
import { FullCalendarDto } from './calendar/dto/full-calendar.dto';
import { FullEventDto } from './event/dto/full-event.dto';
import { EventOwnerGuard } from './event/guards/event-owner.guard';
import { CalendarMemberGuard } from './calendar/guards/calendar-member.guard';
import { EventMemberGuard } from './event/guards/event-member.guard';
import { SendLinkDto } from '../user/email-send/dto/send-link.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { FullCalendarEntryDto } from './calendar-entry/dto/full-calendar-entry.dto';
import { CreateCalendarDto } from './calendar/dto/create-calendar.dto';
import { UpdateEventDto } from './event/dto/update-event.dto';
import { UpdateCalendarDto } from './calendar/dto/update-calendar.dto';
import { EventInviteInfoDto } from './event/dto/event-invite-info.dto';
import { RecurrenceSettings } from './settings/recurrence/models/recurrence-settings.model';
import { CreateRecurrenceSettingsDto } from './settings/recurrence/dto/create-recurrence-settings.dto';
import { validate } from 'class-validator';
import { ReqUser } from '../auth/decorators/user.decorator';
import { FullUserDto } from '../user/dto/full-user.dto';
import { ReqEvent } from './event/decorators/event.decorator';
import { ReqCalendar } from './calendar/decorators/calendar.decorator';

@Controller({
  path: 'event',
  version: `1`,
})
export class EventSystemController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AccessJwtAuthGuard, CalendarOwnerGuard)
  @Post()
  async createEvent(@Body() event: CreateEventDto): Promise<FullEventDto> {
    return await this.eventService.create(event);
  }

  @UseGuards(AccessJwtAuthGuard, EventMemberGuard)
  @Get()
  async getEventById(@ReqEvent() event: FullEventDto): Promise<FullEventDto> {
    return await this.eventService.findById(event._id);
  }

  @UseGuards(AccessJwtAuthGuard, CalendarMemberGuard)
  @Get(`all`)
  async getAllCalendarEvents(
    @ReqCalendar() calendar: FullCalendarDto,
  ): Promise<FullEventDto[]> {
    return await this.eventService.findEventsByCalendar(calendar._id);
  }

  @UseGuards(AccessJwtAuthGuard, EventOwnerGuard)
  @Patch()
  async updateEvent(@Body() event: UpdateEventDto): Promise<FullEventDto> {
    const oldEvent = await this.eventService.findById(event._id);

    if (!oldEvent.recurrenceSettings && event.recurrenceSettings) {
      try {
        const validationPipe = new ValidationPipe({ transform: true });

        await validationPipe.transform(event.recurrenceSettings, {
          metatype: CreateRecurrenceSettingsDto,
          type: `body`,
        });
      } catch (err) {
        throw err;
      }
    }

    return await this.eventService.update(event);
  }

  @UseGuards(AccessJwtAuthGuard, EventOwnerGuard)
  @HttpCode(204)
  @Delete()
  async deleteEvent(@ReqEvent() event: FullEventDto): Promise<void> {
    await this.eventService.delete(event._id);
  }

  @UseGuards(AccessJwtAuthGuard, EventOwnerGuard)
  @HttpCode(204)
  @Post(`invite/send-code`)
  async sendShareInvitation(
    @ReqUser() user: FullUserDto,
    @Body() inviteInfo: EventInviteInfoDto,
  ): Promise<void> {
    await this.eventService.sendShareInvitation(inviteInfo, user.username);
  }

  @UseGuards(AccessJwtAuthGuard, CalendarOwnerGuard)
  @Patch(`invite/validate-code`)
  async validateShareInvitation(
    @ReqUser() user: FullUserDto,
    @ReqCalendar() calendar: FullCalendarDto,
    @Query(`token`) token: string,
  ): Promise<FullEventDto> {
    return await this.eventService.validateShareInvitation(
      user._id,
      calendar._id,
      token,
    );
  }
}
