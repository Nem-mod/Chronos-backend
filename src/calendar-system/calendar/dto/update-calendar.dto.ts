import { PartialType } from '@nestjs/swagger';
import { CreateCalendarDto } from './create-calendar.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateOwnershipDto } from '../../../user/ownership/dto/update-ownership.dto';
import { Type } from 'class-transformer';

export class UpdateCalendarDto extends PartialType(CreateCalendarDto) {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateOwnershipDto)
  users: UpdateOwnershipDto;
}
