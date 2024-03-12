import { IsString } from 'class-validator';
import { TokenDto } from './token.dto';

export class CredentialsDto {
  @IsString()
  refreshToken: TokenDto[`token`];

  @IsString()
  accessToken: TokenDto[`token`];
}
