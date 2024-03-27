import { Injectable } from '@nestjs/common';
import { CalendarSystemService } from './calendar-system.service';
import { OnEvent } from '@nestjs/event-emitter';
import { FullUserDto } from '../user/dto/full-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateCalendarDto } from './calendar/dto/create-calendar.dto';

@Injectable()
export class CalendarSystemListener {
  constructor(private readonly calendarSystemService: CalendarSystemService) {}

  @OnEvent(`user.created`)
  async onUserCreated(userId: CreateUserDto[`_id`]) {
    const defaultCalendar: CreateCalendarDto = {
      name: `My default calendar`,
      timezone: `Europe/London`,
    }; // TODO: get timezone by ip

    await this.calendarSystemService.initCalendarList(userId);
    await this.calendarSystemService.createOwnCalendar(defaultCalendar, userId);
  }

  @OnEvent(`user.deleted`)
  async onUserDeleted(userId: CreateUserDto[`_id`]) {
    await this.calendarSystemService.unsubscribeFromAllCalendars(userId);
  }
}
