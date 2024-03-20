import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EventService } from '../event.service';
import { FullEventDto } from '../dto/full-event.dto';
import { Request as RequestType } from 'express';
import { OwnershipService } from '../../../user/ownership/ownership.service';
import { FullCalendarDto } from '../../calendar/dto/full-calendar.dto';
import { getEventIdFromRequest } from './getEventIdFromRequest';

@Injectable()
export class EventMemberGuard implements CanActivate {
  constructor(
    private readonly eventService: EventService,
    private readonly ownershipService: OwnershipService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const event: FullEventDto = await this.eventService.findById(
      await getEventIdFromRequest(req),
    );

    if (
      !(await this.ownershipService.isMember(
        (event.calendar as FullCalendarDto).users,
        req.user._id,
      ))
    )
      throw new ForbiddenException(`You are not a calendar member`);

    req.event = event;

    return true;
  }
}
