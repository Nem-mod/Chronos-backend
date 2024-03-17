import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../dto/create-user.dto';

export class JwtPayloadDto extends PickType(CreateUserDto, [
  `username`,
] as const) {
  sub: CreateUserDto[`_id`];
}
