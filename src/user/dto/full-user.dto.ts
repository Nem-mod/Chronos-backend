import { UpdateUserDto } from './update-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class FullUserDto extends PartialType(UpdateUserDto) {
  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}
