import { FullCalendarDto } from '../calendar/full-calendar.dto';
import { CreateCalendarDto } from '../calendar/create-calendar.dto';
import { RemindSettings } from '../../models/settings/remind-settings.model';
import { VisibilitySettings } from '../../models/settings/visibility-settings.model';
import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RemindSettingsDto } from '../settings/remind-settings.dto';
import { VisibilitySettingsDto } from '../settings/visibility-settings.dto';

export class CreateCalendarEntryDto {
  @IsOptional()
  @IsString()
  _id: string;

  @IsDefined()
  @IsString()
  calendarId: FullCalendarDto | CreateCalendarDto[`_id`];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RemindSettingsDto)
  remindSetting: RemindSettingsDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VisibilitySettingsDto)
  visibilitySetting: VisibilitySettingsDto;
  // TODO: create ownership manipulation functions in userService, work on calendarService, create refreshToken endpoint
}
