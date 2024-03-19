import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator';
import { IsOneOrNoneFieldPresent } from '../validators/IsOneOrNoneFieldPresent';
import { FrequencyEnum } from '../enums/frequency.enum';

export class CreateRecurrenceSettingsDto {
  @IsEnum(FrequencyEnum)
  frequency: FrequencyEnum;

  @IsInt()
  @Min(1)
  interval: number;

  @IsBoolean()
  @IsOneOrNoneFieldPresent(['count', 'until'])
  isNeverStop: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ValidateIf((o) => !o.isNeverStop)
  count?: number;

  @IsOptional()
  @IsDate()
  @ValidateIf((o) => !o.isNeverStop)
  until?: Date;

  @IsOptional()
  @IsOneOrNoneFieldPresent(['byHour', 'byDay', 'byMonth', 'byYear'])
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  byHour: number[];

  @IsOptional()
  @IsOneOrNoneFieldPresent(['byHour', 'byDay', 'byMonth', 'byYear'])
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  byDay: number[];

  @IsOptional()
  @IsOneOrNoneFieldPresent(['byHour', 'byDay', 'byMonth', 'byYear'])
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  byMonth: number[];

  @IsOptional()
  @IsOneOrNoneFieldPresent(['byHour', 'byDay', 'byMonth', 'byYear'])
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  byYear: number[];

  @IsOptional()
  @IsArray()
  @IsDate({ each: true })
  additionalDates?: Date[];

  @IsOptional()
  @IsArray()
  @IsDate({ each: true })
  exceptionDates?: Date[];
}
