import { FullUserDto } from '../../../user/dto/full-user.dto';
import { FullCalendarDto } from '../dto/full-calendar.dto';
import { FullEventDto } from '../dto/full-event.dto';

declare global {
  namespace Express {
    interface Request {
      event: FullEventDto;
    }
  }
}
