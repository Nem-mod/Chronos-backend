import { IsNotEmpty, IsString } from 'class-validator';
import { SendLinkDto } from '../../../user/email-send/dto/send-link.dto';
import { CreateCalendarDto } from './create-calendar.dto';
import { UpdateCalendarDto } from './update-calendar.dto';

export class CalendarInviteInfoDto extends SendLinkDto {
  @IsString()
  @IsNotEmpty()
  // @ValidateNested({each: true})
  // @Type(() => UpdateCalendarDto)
  calendar: UpdateCalendarDto | CreateCalendarDto[`_id`];
}
