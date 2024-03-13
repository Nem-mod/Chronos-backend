import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class RemindSettingDto {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  secondsBefore: number[];
}
