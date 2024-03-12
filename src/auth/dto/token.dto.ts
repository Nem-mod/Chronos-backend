import { IsDefined, IsString } from 'class-validator';

export class TokenDto {
  @IsDefined()
  @IsString()
  token: string;
}
