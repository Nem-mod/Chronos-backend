import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AccessJwtAuthGuard } from '../../auth/guards/access-jwt-auth.guard';
import { CalendarOwnerGuard } from '../calendar/guards/calendar-owner.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';
import { FullCalendarDto } from '../calendar/dto/full-calendar.dto';
import { FullEventDto } from './dto/full-event.dto';

@Controller({
  path: 'event',
  version: `1`,
})
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AccessJwtAuthGuard, CalendarOwnerGuard)
  @Post()
  async createEvent(@Body() event: CreateEventDto): Promise<FullEventDto> {
    return await this.eventService.create(event);
  }
}
