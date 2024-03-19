import { Prop } from '@nestjs/mongoose';
import {
  IsBoolean,
  IsHexColor,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class VisibilitySettingsDto {
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;
}
