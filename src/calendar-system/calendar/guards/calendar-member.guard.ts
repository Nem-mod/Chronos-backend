import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { OwnershipService } from '../../../user/ownership/ownership.service';
import { CalendarService } from '../calendar.service';
import { FullCalendarDto } from '../dto/full-calendar.dto';
import { getCalendarIdFromRequest } from './getCalendarIdFromRequest';

@Injectable()
export class CalendarMemberGuard implements CanActivate {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly ownershipService: OwnershipService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const calendar: FullCalendarDto = await this.calendarService.findById(
      await getCalendarIdFromRequest(req),
    );

    if (!(await this.ownershipService.isMember(calendar.users, req.user._id)))
      throw new ForbiddenException(`You are not a calendar member`);

    return true;
  }
}
