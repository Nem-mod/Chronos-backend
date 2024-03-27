import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto extends PickType(CreateUserDto, [`password`] as const) {
  @IsNotEmpty()
  @IsString()
  login: string;
}
