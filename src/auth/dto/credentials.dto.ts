import { IsString } from 'class-validator';

export class CredentialsDto {
  @IsString()
  refreshToken: string;

  @IsString()
  accessToken: string;
}
