import {
  Body,
  Controller,
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
import { AccessJwtAuthGuard } from '../auth/guard/access-jwt-auth.guard';
import { Request as RequestType } from 'express';
import { TimezonesService } from './calendar/timezone/timezones.service';

@Controller({
  path: `calendar`,
  version: `1`,
})
export class CalendarSystemController {
  constructor(
    private readonly configService: ConfigService,
    private readonly timezoneService: TimezonesService,
    private readonly calendarService: CalendarService,
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
    return await this.calendarService.createCalendar(calendar, req.user);
  }
}
