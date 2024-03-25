import { PartialType } from '@nestjs/swagger';
import { UpdateEventDto } from './update-event.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FullEventDto extends PartialType(UpdateEventDto) {}
