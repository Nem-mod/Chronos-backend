import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { CreateEventDto } from './create-event.dto';

export class EventInvitePayloadDto {
  userId: CreateUserDto[`_id`];
  eventId: CreateEventDto[`_id`];
}
