import { IsDefined, IsOptional, IsString } from 'class-validator';
import { FullCalendarEntryDto } from '../calendar-entry/full-calendar-entry.dto';
import { CreateCalendarEntryDto } from '../calendar-entry/create-calendar-entry.dto';
import { PartialType } from '@nestjs/swagger';
import { CreateCalendarListDto } from './create-calendar-list.dto';

export class UpdateCalendarListDto extends PartialType(CreateCalendarListDto) {
  @IsOptional()
  @IsString({ each: true })
  calendars?: FullCalendarEntryDto[] | CreateCalendarEntryDto[`_id`][] = [];
}
