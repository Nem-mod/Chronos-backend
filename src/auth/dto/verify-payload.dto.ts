import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class VerifyPayloadDto extends PickType(CreateUserDto, [
  `username`,
] as const) {
  sub: CreateUserDto[`_id`];
}
