import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, [`_id`] as const),
) {
  @IsString()
  @IsNotEmpty()
  _id: CreateUserDto[`_id`];
}
