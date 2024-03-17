import { ForbiddenException, Injectable } from '@nestjs/common';
import { CalendarService } from './calendar/calendar.service';
import { CalendarEntryService } from './calendar-entry/calendar-entry.service';
import { CalendarListService } from './calendar-list/calendar-list.service';
import { CreateCalendarDto } from './calendar/dto/create-calendar.dto';
import { FullCalendarDto } from './calendar/dto/full-calendar.dto';
import { FullUserDto } from '../user/dto/full-user.dto';
import { TimezonesService } from './calendar/timezone/timezones.service';
import { FullCalendarListDto } from './calendar-list/dto/full-calendar-list.dto';
import { FullCalendarEntryDto } from './calendar-entry/dto/full-calendar-entry.dto';
import { OwnershipService } from '../user/ownership/ownership.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateCalendarDto } from './calendar/dto/update-calendar.dto';
import { UpdateCalendarEntryDto } from './calendar-entry/dto/update-calendar-entry.dto';
import { SendLinkDto } from '../user/email-send/dto/send-link.dto';
import { User } from '../user/models/user.model';
import { JwtPayloadDto } from '../user/email-send/dto/jwt-payload.dto';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { EmailSendService } from '../user/email-send/email-send.service';

@Injectable()
export class CalendarSystemService {
  constructor(
    private readonly configService: ConfigService,
    private readonly timezoneService: TimezonesService,
    private readonly ownershipService: OwnershipService,
    private readonly emailSendService: EmailSendService,
    private readonly userService: UserService,
    private readonly calendarService: CalendarService,
    private readonly calendarEntryService: CalendarEntryService,
    private readonly calendarListService: CalendarListService,
  ) {}

  async createOwnCalendar(
    calendar: CreateCalendarDto,
    userId: CreateUserDto[`_id`],
  ): Promise<FullCalendarDto> {
    const newCalendar: FullCalendarDto = await this.calendarService.create(
      calendar,
      userId,
    );
    const calendarEntry: FullCalendarEntryDto =
      await this.calendarEntryService.createCalendarEntry({
        calendar: newCalendar._id,
      });
    await this.calendarListService.addCalendarEntryToList(
      calendarEntry,
      userId,
    );

    return newCalendar;
  }

  async initCalendarList(user: FullUserDto): Promise<FullCalendarListDto> {
    return await this.calendarListService.createCalendarList({ _id: user._id });
  }

  async initTimezoneDatabase(): Promise<void> {
    await this.timezoneService.fillTimezoneDatabase();
  }

  async sendGuestInvitation(
    calendarId: CreateCalendarDto[`_id`],
    linkInfo: SendLinkDto,
  ): Promise<void> {
    const user: User = await this.userService.findByUsername(linkInfo.username);
    // TODO: check here if the user already has this calendar

    linkInfo = await this.emailSendService.prepareLink(
      { username: user.username, sub: calendarId } as JwtPayloadDto,
      linkInfo,
      this.configService.get(`jwt.invite`),
      `inviteToken`,
    );

    await this.emailSendService.sendEmail(
      user.email,
      this.configService.get(`api.sendgrid.verify-template`),
      { link: linkInfo.returnUrl },
    );
  }

  async validateGuestInvitation(userId: CreateUserDto[`_id`], token: string) {
    const payload: JwtPayloadDto =
      await this.emailSendService.validateTokenFromEmail(
        token,
        this.configService.get(`jwt.invite`),
      );
    // TODO: check here if the user in with correct username
    return payload;
  }

  async deleteCalendar(calendarId: CreateCalendarDto[`_id`]): Promise<void> {
    const calendar: FullCalendarDto =
      await this.calendarService.delete(calendarId);
    const allCalendarUserIds: CreateUserDto[`_id`][] =
      await this.ownershipService.getAllUsersIds(calendar.users);

    await this.calendarEntryService.deleteAllCalendarEntries(calendarId);

    for (const userId of allCalendarUserIds)
      await this.calendarListService.clearListFromTombstones(userId);
  }

  async getAllSubscribedCalendars(
    userId: CreateUserDto[`_id`],
  ): Promise<FullCalendarListDto> {
    return await this.calendarListService.getAllCalendarsFromList(userId);
  }

  async updateCalendar(calendar: UpdateCalendarDto): Promise<FullCalendarDto> {
    return await this.calendarService.update(calendar);
  }

  async updateCalendarEntry(
    calendarEntry: UpdateCalendarEntryDto,
  ): Promise<FullCalendarEntryDto> {
    return await this.calendarEntryService.update(calendarEntry);
  }
}
