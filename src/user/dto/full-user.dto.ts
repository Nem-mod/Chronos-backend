import { UpdateUserDto } from './update-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class FullUserDto extends UpdateUserDto {
  @IsOptional()
  @IsBoolean()
  verified: boolean;
}
