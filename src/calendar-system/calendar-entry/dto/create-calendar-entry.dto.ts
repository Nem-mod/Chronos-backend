import { FullCalendarDto } from '../../calendar/dto/full-calendar.dto';
import { CreateCalendarDto } from '../../calendar/dto/create-calendar.dto';
import { RemindSettings } from '../../settings/remind/models/remind-settings.model';
import { VisibilitySettings } from '../../settings/visibility/models/visibility-settings.model';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RemindSettingsDto } from '../../settings/remind/dto/remind-settings.dto';
import { VisibilitySettingsDto } from '../../settings/visibility/dto/visibility-settings.dto';

export class CreateCalendarEntryDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  calendar: FullCalendarDto | CreateCalendarDto[`_id`];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RemindSettingsDto)
  remindSettings?: RemindSettingsDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VisibilitySettingsDto)
  visibilitySettings?: VisibilitySettingsDto;
}
