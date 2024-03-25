import { SendLinkDto } from '../../../user/email-send/dto/send-link.dto';
import { UpdateEventDto } from './update-event.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEventDto } from './create-event.dto';

export class EventInviteInfoDto extends SendLinkDto {
  @IsString()
  @IsNotEmpty()
  // @ValidateNested({each: true})
  // @Type(() => UpdateEventDto)
  event: UpdateEventDto | CreateEventDto[`_id`];
}
