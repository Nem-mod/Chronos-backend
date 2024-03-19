import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { VerifyPayloadDto } from '../auth/dto/verify-payload.dto';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { EmailSendService } from '../user/email-send/email-send.service';
import { InvitePayloadDto } from './calendar/dto/invite-payload.dto';
import { CalendarList } from './calendar-list/models/calendar-list.model';
import { CreateCalendarEntryDto } from './calendar-entry/dto/create-calendar-entry.dto';
import { CreateCalendarListDto } from './calendar-list/dto/create-calendar-list.dto';

@Injectable()
export class CalendarSystemService {
  private expiredInviteTokens: Set<string> = new Set();

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
    senderName: CreateUserDto[`username`],
  ): Promise<void> {
    const user: User = await this.userService.findByUsername(linkInfo.username);
    const calendar: FullCalendarDto =
      await this.calendarService.findById(calendarId);

    if (await this.calendarListService.containsCalendar(user._id, calendarId))
      throw new ConflictException(`User is already guest of this calendar`);

    linkInfo = await this.emailSendService.prepareLink(
      { userId: user._id, calendarId } as InvitePayloadDto,
      linkInfo,
      this.configService.get(`jwt.invite`),
      `inviteToken`,
    );

    await this.emailSendService.sendEmail(
      user.email,
      this.configService.get(`api.sendgrid.invitation-template`),
      {
        calendarName: calendar.name,
        ownerName: senderName,
        link: linkInfo.returnUrl,
      },
    );
  }

  async validateGuestInvitation(userId: CreateUserDto[`_id`], token: string) {
    const payload: InvitePayloadDto =
      await this.emailSendService.validateTokenFromEmail(
        token,
        this.configService.get(`jwt.invite`),
      );

    if (userId.toString() !== payload.userId.toString())
      throw new ForbiddenException(`This invitation isn't for you`);
    if (this.expiredInviteTokens.has(token))
      throw new UnauthorizedException(`This invitation has expired`);
    if (
      await this.calendarListService.containsCalendar(
        userId,
        payload.calendarId,
      )
    )
      throw new ConflictException(`You are already guest of this calendar`);

    this.expiredInviteTokens.add(token);

    const calendarEntry: FullCalendarEntryDto =
      await this.calendarEntryService.createCalendarEntry({
        calendar: payload.calendarId,
      });
    await this.calendarListService.addCalendarEntryToList(
      calendarEntry,
      userId,
    );
    await this.calendarService.addGuest(payload.calendarId, userId);
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

  async unsubscribeFromCalendar(
    userId: CreateUserDto[`_id`],
    calendarEntryId: CreateCalendarEntryDto[`_id`],
  ): Promise<void> {
    if (
      !(await this.calendarListService.containsCalendarEntry(
        userId,
        calendarEntryId,
      ))
    )
      throw new BadRequestException(`You have no calendar entry with this Id`);
    const calendarEntry: FullCalendarEntryDto =
      await this.calendarEntryService.findById(calendarEntryId);

    await this.calendarService.removeGuestOrOwner(
      calendarEntry.calendar as string,
      userId,
    );
    await this.calendarEntryService.delete(calendarEntry._id);
    await this.calendarListService.clearListFromTombstones(userId);
  }

  async unsubscribeFromAllCalendars(
    userId: CreateUserDto[`_id`],
  ): Promise<void> {
    const calendarList: FullCalendarListDto =
      await this.calendarListService.getAllCalendarsFromList(userId);

    for (const calendarEntry of calendarList.calendarEntries as FullCalendarEntryDto[]) {
      await this.calendarService.removeGuestOrOwner(
        (calendarEntry.calendar as FullCalendarDto)._id,
        userId,
      );
      await this.calendarEntryService.delete(calendarEntry._id);
    }
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
