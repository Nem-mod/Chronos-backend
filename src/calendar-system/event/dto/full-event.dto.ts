import { PartialType } from '@nestjs/swagger';
import { UpdateEventDto } from './update-event.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FullEventDto extends PartialType(UpdateEventDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty() // TODO: Create validator for mongodb object ids
  parentEvent: FullEventDto | string;
}
