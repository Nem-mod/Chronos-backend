import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCalendarDto } from './create-calendar.dto';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateOwnershipDto } from '../../../user/ownership/dto/update-ownership.dto';
import { Type } from 'class-transformer';

export class UpdateCalendarDto extends PartialType(
  OmitType(CreateCalendarDto, [`_id`] as const),
) {
  @IsString()
  @IsNotEmpty()
  _id: CreateCalendarDto[`_id`];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateOwnershipDto)
  users?: UpdateOwnershipDto;
}
