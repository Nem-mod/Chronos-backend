import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
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
  async getEventById(
    @Query(`eventId`) eventId: CreateEventDto[`_id`],
  ): Promise<FullEventDto> {
    return await this.eventService.findById(eventId);
  }

  @UseGuards(AccessJwtAuthGuard, CalendarMemberGuard)
  @Get(`all`)
  async getAllCalendarEvents(
    @Query(`calendarId`) calendarId: FullCalendarDto[`_id`],
  ): Promise<FullEventDto[]> {
    return await this.eventService.findEventsByCalendar(calendarId);
  }

  @UseGuards(AccessJwtAuthGuard, EventOwnerGuard)
  @HttpCode(204)
  @Delete()
  async deleteEvent(
    @Query(`eventId`) eventId: CreateEventDto[`_id`],
  ): Promise<void> {
    await this.eventService.delete(eventId);
  }

  @UseGuards(AccessJwtAuthGuard, EventOwnerGuard)
  @HttpCode(204)
  @Post(`invite/send-code`)
  async sendShareInvitation(
    // TODO: Test it
    @Request() req: RequestType, //TODO: create decorator that extract user from request (and calendar, and event)
    @Body(`event`) event: UpdateEventDto,
    @Body() linkInfo: SendLinkDto,
  ): Promise<void> {
    await this.eventService.sendShareInvitation(
      event._id,
      linkInfo,
      req.user.username,
    );
  }

  @UseGuards(AccessJwtAuthGuard, CalendarOwnerGuard)
  @Patch(`invite/validate-code`)
  async validateShareInvitation(
    // TODO: Test it
    @Request() req: RequestType,
    @Query(`token`) token: string,
    @Query(`calendarId`) calendarId: CreateCalendarDto[`_id`],
  ): Promise<FullEventDto> {
    return await this.eventService.validateShareInvitation(
      req.user._id,
      calendarId,
      token,
    );
  }
}
