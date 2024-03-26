import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCalendarDto } from './calendar/dto/create-calendar.dto';
import { FullCalendarDto } from './calendar/dto/full-calendar.dto';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt-auth.guard';
import { Request as RequestType } from 'express';
import { CalendarSystemService } from './calendar-system.service';
import { CalendarOwnerGuard } from './calendar/guards/calendar-owner.guard';
import { FullCalendarListDto } from './calendar-list/dto/full-calendar-list.dto';
import { UpdateCalendarDto } from './calendar/dto/update-calendar.dto';
import { CalendarEntryOwnerGuard } from './calendar-entry/guards/calendar-entry-owner.guard';
import { FullCalendarEntryDto } from './calendar-entry/dto/full-calendar-entry.dto';
import { UpdateCalendarEntryDto } from './calendar-entry/dto/update-calendar-entry.dto';
import { SendLinkDto } from '../user/email-send/dto/send-link.dto';
import { CalendarInviteInfoDto } from './calendar/dto/calendar-invite-info.dto';
import { CalendarMemberGuard } from './calendar/guards/calendar-member.guard';

@Controller({
  path: `calendar`,
  version: `1`,
})
export class CalendarSystemController {
  constructor(
    private readonly configService: ConfigService,
    private readonly calendarSystemService: CalendarSystemService,
  ) {}

  @HttpCode(204)
  @Post(`timezones`)
  async fillTimezoneDatabase(): Promise<void> {
    if (this.configService.get(`stage`) !== `develop`)
      throw new ForbiddenException(`This endpoint is only for development`);
    await this.calendarSystemService.initTimezoneDatabase();
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post()
  async createCalendar(
    @Request() req: RequestType,
    @Body() calendar: CreateCalendarDto,
  ): Promise<{
    calendar: FullCalendarDto;
    calendarEntry: FullCalendarEntryDto;
  }> {
    // TODO: create timezone optional, get timezone by ip if undefined
    return await this.calendarSystemService.createOwnCalendar(
      calendar,
      req.user._id,
    );
  }

  @UseGuards(AccessJwtAuthGuard, CalendarOwnerGuard)
  @HttpCode(204)
  @Post(`invite/send-code`)
  async sendGuestInvitation(
    @Request() req: RequestType,
    @Body() linkInfo: CalendarInviteInfoDto,
  ): Promise<void> {
    await this.calendarSystemService.sendGuestInvitation(
      linkInfo,
      req.user.username,
    );
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch(`invite/validate-code`)
  async validateGuestInvitation(
    @Request() req: RequestType,
    @Query(`token`) token: string,
  ): Promise<{
    calendar: FullCalendarDto;
    calendarEntry: FullCalendarEntryDto;
  }> {
    return await this.calendarSystemService.validateGuestInvitation(
      req.user._id,
      token,
    );
  }

  @UseGuards(AccessJwtAuthGuard, CalendarOwnerGuard)
  @HttpCode(204)
  @Delete()
  async deleteCalendar(@Request() req: RequestType): Promise<void> {
    // TODO: delete events on delete calendar
    await this.calendarSystemService.deleteCalendar(req.calendar._id);
  }

  @UseGuards(AccessJwtAuthGuard, CalendarEntryOwnerGuard)
  @HttpCode(204)
  @Delete(`unsubscribe`)
  async unsubscribeFromCalendar(@Request() req: RequestType) {
    // TODO: Delete calendar if last user is unsubscribed
    await this.calendarSystemService.unsubscribeFromCalendar(
      req.user._id,
      req.calendarEntry._id,
    );
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
  }

  @UseGuards(AccessJwtAuthGuard, CalendarEntryOwnerGuard)
  @Patch(`entry`)
  async updateCalendarEntry(
    @Body() calendarEntry: UpdateCalendarEntryDto,
  ): Promise<FullCalendarEntryDto> {
    return await this.calendarSystemService.updateCalendarEntry(calendarEntry);
  }

  // TODO: Promote guest to owner on another owner request
}
