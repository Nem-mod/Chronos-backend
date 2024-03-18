import { CreateUserDto } from '../../dto/create-user.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateOwnershipDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  owners?: CreateUserDto[`username`][] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  guests?: CreateUserDto[`username`][] = [];
}
