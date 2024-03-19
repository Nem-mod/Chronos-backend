import { Prop } from '@nestjs/mongoose';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class TaskSettingsDto {
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsEnum(PriorityEnum)
  priority?: PriorityEnum;
}
