import { UpdateCalendarDto } from './update-calendar.dto';
import { OmitType } from '@nestjs/swagger';
import { OwnershipDto } from '../../../user/ownership/dto/ownership.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateOwnershipDto } from '../../../user/ownership/dto/update-ownership.dto';

export class FullCalendarDto extends OmitType(UpdateCalendarDto, [
  `users`,
] as const) {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OwnershipDto)
  users: OwnershipDto;
}
