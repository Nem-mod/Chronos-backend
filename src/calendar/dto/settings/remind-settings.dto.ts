import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class RemindSettingsDto {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  secondsBefore: number[];
}
