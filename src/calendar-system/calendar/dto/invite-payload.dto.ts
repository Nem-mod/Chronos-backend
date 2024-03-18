import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { CreateCalendarDto } from './create-calendar.dto';

export class InvitePayloadDto {
  userId: CreateUserDto[`_id`];
  calendarId: CreateCalendarDto[`_id`];
}
