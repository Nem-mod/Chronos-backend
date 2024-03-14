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
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/calendar/create-calendar.dto';
import { FullCalendarDto } from './dto/calendar/full-calendar.dto';
import { AccessJwtAuthGuard } from '../auth/guard/access-jwt-auth.guard';
import { Request as RequestType } from 'express';

@Controller({
  path: `calendar`,
  version: `1`,
})
export class CalendarController {
  constructor(
    private readonly configService: ConfigService,
    private readonly calendarService: CalendarService,
  ) {}

  @HttpCode(204)
  @Post(`timezones`)
  async fillTimezoneDatabase() {
    if (this.configService.get(`stage`) !== `develop`)
      throw new ForbiddenException(`This endpoint is only for development`);
    await this.calendarService.fillTimezoneDatabase();
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
