import { IsDefined, IsOptional, IsString } from 'class-validator';
import { FullCalendarEntryDto } from '../../calendar-entry/dto/full-calendar-entry.dto';
import { CreateCalendarEntryDto } from '../../calendar-entry/dto/create-calendar-entry.dto';
import { PartialType } from '@nestjs/swagger';
import { CreateCalendarListDto } from './create-calendar-list.dto';

export class UpdateCalendarListDto extends PartialType(CreateCalendarListDto) {
  @IsOptional()
  @IsString({ each: true })
  calendarEntries?: FullCalendarEntryDto[] | CreateCalendarEntryDto[`_id`][] =
    [];
}
