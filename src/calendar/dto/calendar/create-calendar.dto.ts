import { Timezone } from '../../models/settings/timezone.model';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { TimezonteDto } from '../settings/timezonte.dto';
import { OwnershipDto } from '../../../user/dto/ownership/ownership.dto';
import { Type } from 'class-transformer';

export class CreateCalendarDto {
  @IsOptional()
  @IsString()
  _id: string;

  @IsDefined()
  @MinLength(3)
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  timezone: Timezone | TimezonteDto[`_id`];

  // @ValidateNested({ each: true })
  // @Type(() => OwnershipDto)
  // users: OwnershipDto;
}
