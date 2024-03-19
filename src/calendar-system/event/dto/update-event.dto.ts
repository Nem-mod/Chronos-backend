import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateRecurrenceSettingsDto } from '../../settings/recurrence/dto/update-recurrence-settings.dto';

export class UpdateEventDto extends PartialType(
  OmitType(CreateEventDto, [`_id`, `recurrenceSettings`] as const),
) {
  @IsString()
  @IsNotEmpty()
  _id: CreateEventDto[`_id`];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateRecurrenceSettingsDto)
  recurrenceSettings?: UpdateRecurrenceSettingsDto;
}
