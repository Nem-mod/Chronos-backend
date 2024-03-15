import { Prop } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';

export class TimezonteDto {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  label: string;

  @IsString()
  utc: string;
}
