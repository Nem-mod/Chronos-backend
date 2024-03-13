import { IsDefined, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../user/dto/user/create-user.dto';

export class SendVerifyLinkDto extends PickType(CreateUserDto, [
  `username`,
] as const) {
  @IsDefined()
  @IsString()
  returnUrl: string;
}
