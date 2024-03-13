import { Timezone } from '../../models/settings/timezone.model';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { TimezonteDto } from '../settings/timezonte.dto';

export class CreateCalendarDto {
  @IsOptional()
  @IsString()
  _id: string;

  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsDefined()
  @IsString()
  timezone: Timezone | TimezonteDto[`_id`];
}
