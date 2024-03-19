import { Timezone } from '../../timezone/models/timezone.model';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { TimezonteDto } from '../../timezone/dto/timezonte.dto';
import { OwnershipDto } from '../../../user/ownership/dto/ownership.dto';
import { Type } from 'class-transformer';

export class CreateCalendarDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  timezone: Timezone | TimezonteDto[`_id`];

  // @ValidateNested({ each: true })
  // @Type(() => OwnershipDto)
  // users: OwnershipDto;
}
