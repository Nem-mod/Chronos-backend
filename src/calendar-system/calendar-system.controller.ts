import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CalendarService } from './calendar/calendar.service';
import { CreateCalendarDto } from './calendar/dto/create-calendar.dto';
import { FullCalendarDto } from './calendar/dto/full-calendar.dto';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt-auth.guard';
import { Request as RequestType } from 'express';
import { TimezonesService } from './calendar/timezone/timezones.service';
import { CalendarSystemService } from './calendar-system.service';
import { CalendarOwnerGuard } from './calendar/guards/calendar-owner.guard';
import { CalendarListService } from './calendar-list/calendar-list.service';
import { FullCalendarListDto } from './calendar-list/dto/full-calendar-list.dto';
import { UpdateCalendarDto } from './calendar/dto/update-calendar.dto';
import { CalendarEntryOwnerGuard } from './calendar-entry/guards/calendar-entry-owner.guard';
import { FullCalendarEntryDto } from './calendar-entry/dto/full-calendar-entry.dto';
import { UpdateCalendarEntryDto } from './calendar-entry/dto/update-calendar-entry.dto';

@Controller({
  path: `calendar`,
  version: `1`,
})
export class CalendarSystemController {
  constructor(
    private readonly configService: ConfigService,
    private readonly timezoneService: TimezonesService,
    private readonly calendarSystemService: CalendarSystemService,
  ) {}

  @HttpCode(204)
  @Post(`timezones`)
  async fillTimezoneDatabase() {
    if (this.configService.get(`stage`) !== `develop`)
      throw new ForbiddenException(`This endpoint is only for development`);
    await this.timezoneService.fillTimezoneDatabase();
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post()
  async createCalendar(
    @Request() req: RequestType,
    @Body() calendar: CreateCalendarDto,
  ): Promise<FullCalendarDto> {
    return await this.calendarSystemService.createOwnCalendar(
      calendar,
      req.user._id,
    );
  }

  @UseGuards(AccessJwtAuthGuard, CalendarOwnerGuard)
  @HttpCode(204)
  @Delete()
  async deleteCalendar(@Request() req: RequestType) {
    await this.calendarSystemService.deleteCalendar(req.calendar._id);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get(`all`)
  async getAllSubscribedCalendars(
    @Request() req: RequestType,
  ): Promise<FullCalendarListDto> {
    return await this.calendarSystemService.getAllSubscribedCalendars(
      req.user._id,
    );
  }

  @UseGuards(AccessJwtAuthGuard, CalendarOwnerGuard)
  @Patch()
  async updateCalendar(
    @Body() calendar: UpdateCalendarDto,
  ): Promise<FullCalendarDto> {
    return await this.calendarSystemService.updateCalendar(calendar);
  } // TODO: Create CalendarEntryOwnerGuard, update calendar entry

  @UseGuards(AccessJwtAuthGuard, CalendarEntryOwnerGuard)
  @Patch(`entry`)
  async updateCalendarEntry(
    @Body() calendarEntry: UpdateCalendarEntryDto,
  ): Promise<FullCalendarEntryDto> {
    return await this.calendarSystemService.updateCalendarEntry(calendarEntry);
  }
}
