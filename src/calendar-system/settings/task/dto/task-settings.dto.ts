import { Prop } from '@nestjs/mongoose';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PriorityEnum } from '../enums/priority.enum';

export class TaskSettingsDto {
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsEnum(PriorityEnum)
  priority?: PriorityEnum;
}
