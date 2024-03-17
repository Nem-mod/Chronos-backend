import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CalendarListService } from '../../calendar-list/calendar-list.service';
import { CalendarList } from '../../calendar-list/models/calendar-list.model';
import { FullCalendarListDto } from '../../calendar-list/dto/full-calendar-list.dto';
import { CalendarEntryService } from '../calendar-entry.service';
import { FullCalendarEntryDto } from '../dto/full-calendar-entry.dto';
import { FullCalendarDto } from '../../calendar/dto/full-calendar.dto';

@Injectable()
export class CalendarEntryOwnerGuard implements CanActivate {
  constructor(
    private readonly calendarListService: CalendarListService,
    private readonly calendarEntryService: CalendarEntryService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const calendarEntry: FullCalendarEntryDto =
      await this.getCalendarEntryFromRequest(req);

    if (
      !(await this.calendarListService.containsCalendarEntry(
        user._id,
        calendarEntry._id,
      ))
    ) {
      throw new ForbiddenException(`You are not a calendar entry owner`);
    }
    req.calendarEntry = calendarEntry;

    return true;
  }

  async getCalendarEntryFromRequest(req: any): Promise<FullCalendarEntryDto> {
    const calendarEntryId = req.body._id;
    return await this.calendarEntryService.findById(calendarEntryId);
  }
}
