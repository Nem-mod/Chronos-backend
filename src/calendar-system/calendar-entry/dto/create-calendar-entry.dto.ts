import { FullCalendarDto } from '../../calendar/dto/full-calendar.dto';
import { CreateCalendarDto } from '../../calendar/dto/create-calendar.dto';
import { RemindSettings } from '../remind-settings/models/remind-settings.model';
import { VisibilitySettings } from '../visibility-settings/models/visibility-settings.model';
import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RemindSettingsDto } from '../remind-settings/dto/remind-settings.dto';
import { VisibilitySettingsDto } from '../visibility-settings/dto/visibility-settings.dto';

export class CreateCalendarEntryDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsDefined()
  @IsString()
  calendarId: FullCalendarDto | CreateCalendarDto[`_id`];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RemindSettingsDto)
  remindSettings?: RemindSettingsDto = null;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VisibilitySettingsDto)
  visibilitySettings?: VisibilitySettingsDto = null;
}
