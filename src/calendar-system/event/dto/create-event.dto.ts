import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { RecurrenceSettings } from '../../settings/recurrence/models/recurrence-settings.model';
import { TaskSettingsDto } from '../../settings/task/dto/task-settings.dto';
import { Type } from 'class-transformer';
import { CreateRecurrenceSettingsDto } from '../../settings/recurrence/dto/create-recurrence-settings.dto';
import { Prop } from '@nestjs/mongoose';
import { Timezone } from '../../timezone/models/timezone.model';
import { TimezonteDto } from '../../timezone/dto/timezonte.dto';
import mongoose from 'mongoose';
import { Calendar } from '../../calendar/models/calendar.model';
import { FullCalendarDto } from '../../calendar/dto/full-calendar.dto';
import { CreateCalendarDto } from '../../calendar/dto/create-calendar.dto';
import { FullEventDto } from './full-event.dto';

export class CreateEventDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  calendar: FullCalendarDto | CreateCalendarDto[`_id`];

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TaskSettingsDto)
  taskSettings?: TaskSettingsDto;

  @IsBoolean()
  @IsDefined()
  isAllDay: boolean;

  @IsString()
  @IsNotEmpty()
  timezone: Timezone | TimezonteDto[`_id`];

  @ValidateIf((o) => !o.isAllDay)
  @IsDate()
  @IsDefined()
  start: Date;

  @ValidateIf((o) => !o.isAllDay)
  @IsDate()
  @IsDefined()
  end: Date;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateRecurrenceSettingsDto)
  recurrenceSettings?: CreateRecurrenceSettingsDto;

  @IsOptional()
  @IsString()
  @IsNotEmpty() // TODO: Create validator for mongodb object ids
  parentEvent: FullEventDto | FullEventDto[`_id`];
}
