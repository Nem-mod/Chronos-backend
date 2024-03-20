import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt-auth.guard';
import { CalendarOwnerGuard } from './calendar/guards/calendar-owner.guard';
import { CreateEventDto } from './event/dto/create-event.dto';
import { EventService } from './event/event.service';
import { FullCalendarDto } from './calendar/dto/full-calendar.dto';
import { FullEventDto } from './event/dto/full-event.dto';
import { EventOwnerGuard } from './event/guards/event-owner.guard';
import { CalendarMemberGuard } from './calendar/guards/calendar-member.guard';
import { EventMemberGuard } from './event/guards/event-member.guard';

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
}
