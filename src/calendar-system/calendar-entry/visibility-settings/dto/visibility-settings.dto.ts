import { Prop } from '@nestjs/mongoose';
import { IsBoolean, IsHexColor, IsOptional, IsString } from 'class-validator';

export class VisibilitySettingsDto {
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
