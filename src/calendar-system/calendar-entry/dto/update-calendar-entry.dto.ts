import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCalendarEntryDto } from './create-calendar-entry.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCalendarEntryDto extends PartialType(
  OmitType(CreateCalendarEntryDto, [`_id`] as const),
) {
  @IsString()
  @IsNotEmpty()
  _id: CreateCalendarEntryDto[`_id`];
}
