import { FullUserDto } from '../../../user/dto/full-user.dto';
import { FullCalendarDto } from '../dto/full-calendar.dto';

declare global {
  namespace Express {
    interface Request {
      calendar: FullCalendarDto;
    }
  }
}
