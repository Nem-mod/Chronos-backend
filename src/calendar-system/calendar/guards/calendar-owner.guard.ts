import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request as RequestType } from 'express';
import { CalendarService } from '../calendar.service';
import { FullCalendarDto } from '../dto/full-calendar.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OwnershipService } from '../../../user/ownership/ownership.service';

@Injectable()
export class CalendarOwnerGuard implements CanActivate {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly ownershipService: OwnershipService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const calendar: FullCalendarDto =
      await this.getCalendarFromRequest(request);

    if (
      !(await this.ownershipService.isOwner(calendar.users, request.user._id))
    )
      throw new ForbiddenException(`You are not a calendar owner`);

    request.calendar = calendar;

    return true;
  }

  async getCalendarFromRequest(req: RequestType): Promise<FullCalendarDto> {
    const calendarId = req.query.calendarId;
    return await this.calendarService.findById(calendarId as string);
  }
}
