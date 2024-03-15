import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
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

@Controller({
  path: `calendar`,
  version: `1`,
})
export class CalendarSystemController {
  constructor(
    private readonly configService: ConfigService,
    private readonly timezoneService: TimezonesService,
    private readonly calendarService: CalendarService,
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
      req.user,
    );
  }

  @UseGuards(AccessJwtAuthGuard, CalendarOwnerGuard)
  @Delete()
  async deleteCalendar(@Request() req: RequestType) {
    await this.calendarSystemService.deleteCalendar(req.calendar._id);
  }
}
