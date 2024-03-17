import { FullUserDto } from '../../../user/dto/full-user.dto';
import { FullCalendarDto } from '../dto/full-calendar.dto';
import { FullCalendarEntryDto } from '../dto/full-calendar-entry.dto';

declare global {
  namespace Express {
    interface Request {
      calendarEntry: FullCalendarEntryDto;
    }
  }
}
