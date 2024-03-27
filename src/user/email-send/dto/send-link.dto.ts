import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../dto/create-user.dto';

export class SendLinkDto extends PickType(CreateUserDto, [`email`] as const) {
  @IsNotEmpty()
  @IsString()
  returnUrl: string;
}
