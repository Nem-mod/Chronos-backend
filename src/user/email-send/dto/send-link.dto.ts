import { IsDefined, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../dto/create-user.dto';

export class SendLinkDto extends PickType(CreateUserDto, [
  `username`,
] as const) {
  @IsDefined()
  @IsString()
  returnUrl: string;
}
